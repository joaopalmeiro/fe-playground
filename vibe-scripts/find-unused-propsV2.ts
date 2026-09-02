/**
 * Reports props declared on a component's props type that the component never
 * actually consumes — either never pulled out of the props parameter at all, or
 * pulled out and then never read.
 *
 * The first case is the blind spot in the existing lint chain. `tsc`'s
 * `noUnusedLocals` (on in tsconfig.app.json) fails the build for a prop that is
 * destructured and then never read, so that case should never survive to CI.
 * But a member declared on `FooProps` and simply left out of the destructuring
 * is not a local, not an export, and not a rule oxlint ships — so nothing sees
 * it. `OctreeViewerProps.embedded` sat there unnoticed for exactly that reason.
 *
 * Two compiler API calls do the real work:
 *
 *   1. `checker.getTypeAtLocation(param).getProperties()` expands the props type
 *      into member symbols, so intersections, `extends` chains and mapped types
 *      all resolve without walking the interface by hand.
 *   2. `checker.getSymbolAtLocation(identifier)` decides whether an identifier in
 *      the body is *this* destructured binding rather than some unrelated name
 *      that happens to match. Symbol identity, not string comparison.
 *
 * Usage: node --experimental-strip-types scripts/find-unused-props.ts [tsconfig]
 */

import path from "node:path";
import process from "node:process";

import ts from "typescript";

const PROJECT_ROOT = process.cwd();

type Verdict = "not-destructured" | "unread";

interface Finding {
  prop: string;
  verdict: Verdict;
  /** Line of the member in the props type. */
  declaredAt: number;
  /** Local name, when it differs from the prop name (`foo: fooProp`). */
  alias: string | undefined;
}

interface ComponentReport {
  name: string;
  file: string;
  line: number;
  propsTypeName: string;
  propCount: number;
  findings: Finding[];
  /** Set when the props parameter's shape defeats static tracking. */
  skipped: string | undefined;
}

/** A function-like node that could be a component, normalised across syntaxes. */
interface ComponentCandidate {
  name: string;
  line: number;
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
  body: ts.Node;
}

function createProgram(configPath: string): ts.Program {
  const host: ts.ParseConfigFileHost = {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  };

  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, undefined, host);
  if (!parsed) throw new Error(`Could not read ${configPath}`);

  return ts.createProgram({ rootNames: parsed.fileNames, options: parsed.options });
}

function lineOf(node: ts.Node): number {
  const sourceFile = node.getSourceFile();
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function isProjectFile(fileName: string): boolean {
  return fileName.startsWith(PROJECT_ROOT) && !fileName.includes("/node_modules/");
}

function containsJsx(node: ts.Node): boolean {
  let found = false;
  const visit = (child: ts.Node): void => {
    if (found) return;
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
      found = true;
      return;
    }
    ts.forEachChild(child, visit);
  };
  visit(node);
  return found;
}

/** `function Foo() {}` and `const Foo = () => {}` reach the same shape here. */
function asComponentCandidate(node: ts.Node): ComponentCandidate | undefined {
  if (ts.isFunctionDeclaration(node) && node.name && node.body) {
    return { name: node.name.text, line: lineOf(node), parameters: node.parameters, body: node.body };
  }

  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.initializer &&
    (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) {
    return {
      name: node.name.text,
      line: lineOf(node),
      parameters: node.initializer.parameters,
      body: node.initializer.body,
    };
  }

  return undefined;
}

/**
 * Members of the props type that this codebase owns.
 *
 * Members inherited from library types (`HTMLAttributes` and friends) are
 * dropped — a component is not expected to read every DOM attribute it accepts,
 * and reporting them would bury the real findings.
 */
function declaredProps(param: ts.ParameterDeclaration, checker: ts.TypeChecker): Map<string, number> {
  const props = new Map<string, number>();

  for (const symbol of checker.getTypeAtLocation(param).getProperties()) {
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (!declaration || !isProjectFile(declaration.getSourceFile().fileName)) continue;
    props.set(symbol.getName(), lineOf(declaration));
  }

  return props;
}

/**
 * Every symbol referenced by an identifier anywhere in `body`.
 *
 * Shorthand object properties need special handling: in `{ minZoom }`,
 * `getSymbolAtLocation` returns the *object literal's* `minZoom` property
 * symbol, not the variable being read. Without `getShorthandAssignmentValueSymbol`
 * every prop forwarded that way — and Scatterplot forwards eight of them into
 * `adaptiveGradientParams` — would look unread.
 */
function collectReferencedSymbols(body: ts.Node, checker: ts.TypeChecker): Set<ts.Symbol> {
  const referenced = new Set<ts.Symbol>();

  const visit = (node: ts.Node): void => {
    if (ts.isIdentifier(node)) {
      const parent = node.parent;

      if (ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
        const valueSymbol = checker.getShorthandAssignmentValueSymbol(parent);
        if (valueSymbol) referenced.add(valueSymbol);
      } else {
        const symbol = checker.getSymbolAtLocation(node);
        if (symbol) referenced.add(symbol);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(body);
  return referenced;
}

/**
 * Which props a destructuring pattern pulls out, and under what local name.
 *
 * Returns `undefined` on a rest element: `...rest` can forward any remaining
 * prop onwards, so nothing left out of the pattern can be called unused.
 */
function bindings(pattern: ts.ObjectBindingPattern): Map<string, ts.BindingElement> | undefined {
  const bound = new Map<string, ts.BindingElement>();

  for (const element of pattern.elements) {
    if (element.dotDotDotToken) return undefined;

    const source = element.propertyName ?? element.name;
    if (ts.isIdentifier(source) || ts.isStringLiteral(source)) bound.set(source.text, element);
    else return undefined; // computed key — cannot attribute it to a prop name
  }

  return bound;
}

function analyze(
  candidate: ComponentCandidate,
  param: ts.ParameterDeclaration,
  props: Map<string, number>,
  checker: ts.TypeChecker,
): Pick<ComponentReport, "findings" | "skipped"> {
  // Whole-object parameter (`function Foo(props: FooProps)`): a prop counts as
  // consumed when some `props.<name>` reads it. Any other use of `props` — a
  // spread, being handed to a helper — could read anything, so bail rather than
  // guess.
  if (ts.isIdentifier(param.name)) {
    const paramName = param.name.text;
    const read = new Set<string>();
    let escapes = false;

    const visit = (node: ts.Node): void => {
      if (ts.isIdentifier(node) && node.text === paramName) {
        const parent = node.parent;
        if (ts.isPropertyAccessExpression(parent) && parent.expression === node) read.add(parent.name.text);
        else escapes = true;
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(candidate.body);

    if (escapes) return { findings: [], skipped: `\`${paramName}\` is used as a whole object` };

    const findings: Finding[] = [...props]
      .filter(([name]) => !read.has(name))
      .map(([name, declaredAt]) => ({ prop: name, verdict: "not-destructured", declaredAt, alias: undefined }));

    return { findings, skipped: undefined };
  }

  if (!ts.isObjectBindingPattern(param.name)) {
    return { findings: [], skipped: "unsupported props parameter" };
  }

  const bound = bindings(param.name);
  if (!bound) return { findings: [], skipped: "rest element in the props pattern" };

  // Default values can reference sibling bindings (`{ a, b = a }`), so those
  // initializers are part of the body for reference-counting purposes.
  const referenced = collectReferencedSymbols(candidate.body, checker);
  for (const element of param.name.elements) {
    if (element.initializer) {
      for (const symbol of collectReferencedSymbols(element.initializer, checker)) referenced.add(symbol);
    }
  }

  const findings: Finding[] = [];

  for (const [name, declaredAt] of props) {
    const element = bound.get(name);

    if (!element) {
      findings.push({ prop: name, verdict: "not-destructured", declaredAt, alias: undefined });
      continue;
    }

    // Nested pattern (`{ config: { mode } }`) — the prop is genuinely consumed.
    if (!ts.isIdentifier(element.name)) continue;

    const local = checker.getSymbolAtLocation(element.name);
    if (local && !referenced.has(local)) {
      const alias = element.propertyName ? element.name.text : undefined;
      findings.push({ prop: name, verdict: "unread", declaredAt, alias });
    }
  }

  return { findings, skipped: undefined };
}

function collect(sourceFile: ts.SourceFile, checker: ts.TypeChecker, out: ComponentReport[]): void {
  const visit = (node: ts.Node): void => {
    const candidate = asComponentCandidate(node);

    if (candidate && /^[A-Z]/.test(candidate.name) && candidate.parameters.length > 0) {
      const param = candidate.parameters[0];

      if (param.type && containsJsx(candidate.body)) {
        const props = declaredProps(param, checker);

        if (props.size > 0) {
          const { findings, skipped } = analyze(candidate, param, props, checker);

          out.push({
            name: candidate.name,
            file: sourceFile.fileName,
            line: candidate.line,
            propsTypeName: ts.isTypeReferenceNode(param.type)
              ? param.type.typeName.getText()
              : checker.typeToString(checker.getTypeAtLocation(param)),
            propCount: props.size,
            findings,
            skipped,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

const EXPLANATION: Record<Verdict, string> = {
  "not-destructured": "declared but never destructured or read",
  unread: "destructured but never read",
};

function report(components: ComponentReport[]): number {
  const sorted = components.toSorted((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  let findings = 0;

  for (const component of sorted) {
    if (component.findings.length === 0) continue;
    findings += component.findings.length;

    const relativePath = path.relative(PROJECT_ROOT, component.file);
    console.log(`\n${relativePath}:${component.line}`);
    console.log(`  ${component.name}  props: ${component.propsTypeName}  (${component.propCount} declared)`);

    const width = Math.max(...component.findings.map((finding) => finding.prop.length));
    for (const finding of component.findings.toSorted((a, b) => a.declaredAt - b.declaredAt)) {
      const label = finding.alias ? `${finding.prop} (as ${finding.alias})` : finding.prop;
      console.log(`    ${label.padEnd(width)}  ${EXPLANATION[finding.verdict]}  (:${finding.declaredAt})`);
    }
  }

  const skipped = sorted.filter((component) => component.skipped !== undefined);
  if (skipped.length > 0) {
    console.log(`\nNot analysed:`);
    for (const component of skipped) {
      console.log(`  ${component.name} — ${component.skipped} (${path.relative(PROJECT_ROOT, component.file)})`);
    }
  }

  console.log(
    findings === 0
      ? `\nChecked ${sorted.length} components. Every declared prop is consumed.`
      : `\n${findings} unconsumed prop(s) across ${sorted.length} components checked.`,
  );

  return findings === 0 ? 0 : 1;
}

function main(): number {
  const configPath = path.resolve(PROJECT_ROOT, process.argv[2] ?? "tsconfig.app.json");
  // One program, one checker: symbol identity only holds within a single program,
  // and the whole reference check depends on it.
  const program = createProgram(configPath);
  const checker = program.getTypeChecker();

  const components: ComponentReport[] = [];
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile && isProjectFile(sourceFile.fileName)) {
      collect(sourceFile, checker, components);
    }
  }

  return report(components);
}

process.exitCode = main();
