/**
 * Reports props that are declared on a component but never actually supplied by
 * any caller, and props that no caller supplies *and* the component never reads.
 *
 * Why this needs the compiler API rather than a regex: deciding that
 * `<ComponentX>` at a call site refers to the `ComponentX` function in
 * another file means resolving an identifier through a default-import alias to
 * its declaration. And expanding `ComponentXProps` into a flat list of member
 * names means asking the type checker, so intersections, `extends`, and mapped
 * types all behave. Both are one checker call each.
 *
 * Not covered by the existing lint chain:
 *   - `tsc --noUnusedLocals` flags a prop that is destructured and then never
 *     read, but says nothing about an interface member that is never
 *     destructured in the first place, nor about optional props no caller passes.
 *   - knip works at the module-export level and does not look inside interfaces.
 *   - oxlint has no `react/no-unused-prop-types`.
 *
 * Usage: node --experimental-strip-types scripts/find-unused-props.ts [tsconfig]
 */

import path from "node:path";
import process from "node:process";

import ts from "typescript";

const PROJECT_ROOT = process.cwd();

interface PropInfo {
  name: string;
  optional: boolean;
  line: number;
}

interface ComponentInfo {
  name: string;
  file: string;
  line: number;
  propsTypeName: string;
  props: PropInfo[];
  /** Prop names the body reads. `null` when the shape defeats static tracking. */
  readInside: Set<string> | null;
  callSites: number;
  passed: Set<string>;
  /** A `{...spread}` at some call site means "passed" is a lower bound only. */
  spreadAtCallSite: boolean;
}

/** A function-like node that could be a component, normalised across syntaxes. */
interface ComponentCandidate {
  /**
   * The node the component's *symbol* points at. This is the join key for the
   * call-site pass: `checker.getSymbolAtLocation(<tagName>)` resolves to this
   * same node, so identity comparison is enough and no name matching is needed.
   */
  key: ts.Node;
  name: string;
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
  body: ts.Node | undefined;
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

function relative(fileName: string): string {
  return path.relative(PROJECT_ROOT, fileName);
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
  if (ts.isFunctionDeclaration(node) && node.name) {
    return { key: node, name: node.name.text, parameters: node.parameters, body: node.body };
  }

  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.initializer &&
    (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) {
    return {
      key: node,
      name: node.name.text,
      parameters: node.initializer.parameters,
      body: node.initializer.body,
    };
  }

  return undefined;
}

/**
 * Which prop names the body actually reads.
 *
 * A destructured name counts as read because `noUnusedLocals` (on in
 * tsconfig.app.json) already fails the build for one that is not. Returns
 * `null` for `...rest` or for a whole-object param that escapes into an
 * expression we cannot follow, since either can consume a prop invisibly.
 */
function collectReadProps(candidate: ComponentCandidate, param: ts.ParameterDeclaration): Set<string> | null {
  if (ts.isObjectBindingPattern(param.name)) {
    const read = new Set<string>();
    for (const element of param.name.elements) {
      if (element.dotDotDotToken) return null;
      const source = element.propertyName ?? element.name;
      if (ts.isIdentifier(source)) read.add(source.text);
      else if (ts.isStringLiteral(source)) read.add(source.text);
      else return null;
    }
    return read;
  }

  if (!ts.isIdentifier(param.name) || !candidate.body) return null;

  // Whole-object param: accept `props.foo`, bail on any other reference to
  // `props` (spread, re-assignment, passing it on) because that could read
  // anything.
  const paramName = param.name.text;
  const read = new Set<string>();
  let trackable = true;

  const visit = (node: ts.Node): void => {
    if (ts.isIdentifier(node) && node.text === paramName) {
      const parent = node.parent;
      const isPropertyAccessBase = ts.isPropertyAccessExpression(parent) && parent.expression === node;
      if (isPropertyAccessBase) read.add(parent.name.text);
      else trackable = false;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(candidate.body);

  return trackable ? read : null;
}

function collectComponents(sourceFile: ts.SourceFile, checker: ts.TypeChecker, out: Map<ts.Node, ComponentInfo>): void {
  const visit = (node: ts.Node): void => {
    const candidate = asComponentCandidate(node);

    if (candidate && /^[A-Z]/.test(candidate.name) && candidate.parameters.length > 0 && candidate.body) {
      const param = candidate.parameters[0];

      if (param.type && containsJsx(candidate.body)) {
        // Ask the checker instead of walking the interface: this flattens
        // intersections and `extends` chains into plain member symbols.
        const propSymbols = checker.getTypeAtLocation(param).getProperties();

        const props: PropInfo[] = [];
        for (const symbol of propSymbols) {
          const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
          // Skip members inherited from library types (HTMLAttributes and
          // friends) — those are not this codebase's to delete.
          if (!declaration || !isProjectFile(declaration.getSourceFile().fileName)) continue;

          props.push({
            name: symbol.getName(),
            optional: (symbol.getFlags() & ts.SymbolFlags.Optional) !== 0,
            line: lineOf(declaration),
          });
        }

        if (props.length > 0) {
          out.set(candidate.key, {
            name: candidate.name,
            file: sourceFile.fileName,
            line: lineOf(node),
            propsTypeName: ts.isTypeReferenceNode(param.type)
              ? param.type.typeName.getText()
              : checker.typeToString(checker.getTypeAtLocation(param)),
            props,
            readInside: collectReadProps(candidate, param),
            callSites: 0,
            passed: new Set<string>(),
            spreadAtCallSite: false,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

/** Resolve a JSX tag to the declaration node its symbol points at. */
function resolveTagDeclaration(tagName: ts.JsxTagNameExpression, checker: ts.TypeChecker): ts.Node | undefined {
  let symbol = checker.getSymbolAtLocation(tagName);
  if (!symbol) return undefined;

  // `import ComponentX from "./ComponentX.tsx"` binds an alias symbol;
  // follow it to the real declaration.
  if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);

  return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

/** `<Comp>text</Comp>` supplies `children` with no attribute to look at. */
function passesChildren(element: ts.JsxOpeningElement | ts.JsxSelfClosingElement): boolean {
  if (ts.isJsxSelfClosingElement(element)) return false;
  const parent = element.parent;
  if (!ts.isJsxElement(parent)) return false;

  return parent.children.some((child) => !(ts.isJsxText(child) && child.containsOnlyTriviaWhiteSpaces));
}

function collectCallSites(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  components: Map<ts.Node, ComponentInfo>,
): void {
  const visit = (node: ts.Node): void => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const declaration = resolveTagDeclaration(node.tagName, checker);
      const component = declaration ? components.get(declaration) : undefined;

      if (component) {
        component.callSites += 1;

        for (const attribute of node.attributes.properties) {
          if (ts.isJsxSpreadAttribute(attribute)) component.spreadAtCallSite = true;
          else component.passed.add(attribute.name.getText());
        }

        if (passesChildren(node)) component.passed.add("children");
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

function report(components: Map<ts.Node, ComponentInfo>): number {
  let findings = 0;

  const sorted = [...components.values()].toSorted((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  for (const component of sorted) {
    // No call sites at all means every prop is trivially "never passed", which
    // is noise rather than a finding. Same for spread: we only know a subset of
    // what is passed, so we cannot claim anything is missing.
    if (component.callSites === 0 || component.spreadAtCallSite) continue;

    const dead = component.props.filter((prop) => !component.passed.has(prop.name));
    if (dead.length === 0) continue;

    findings += dead.length;

    const sites = component.callSites === 1 ? "1 call site" : `${component.callSites} call sites`;
    console.log(`\n${relative(component.file)}:${component.line}`);
    console.log(`  ${component.name}  props: ${component.propsTypeName}  (${sites})`);

    const width = Math.max(...dead.map((prop) => prop.name.length));
    for (const prop of dead) {
      const alsoUnread = component.readInside !== null && !component.readInside.has(prop.name);
      const detail = alsoUnread ? "never passed, never read in the body" : "never passed by any caller";
      console.log(`    ${prop.name.padEnd(width)}  ${detail}  (:${prop.line})`);
    }
  }

  const skipped = sorted.filter((component) => component.spreadAtCallSite);
  if (skipped.length > 0) {
    console.log(`\nSkipped (JSX spread at a call site hides which props are passed):`);
    for (const component of skipped) console.log(`  ${component.name} — ${relative(component.file)}`);
  }

  if (findings === 0) {
    console.log(`Checked ${sorted.length} components. No unused props.`);
    return 0;
  }

  console.log(`\n${findings} unused prop(s) across ${sorted.length} components checked.`);
  return 1;
}

function main(): number {
  const configPath = path.resolve(PROJECT_ROOT, process.argv[2] ?? "tsconfig.app.json");
  const program = createProgram(configPath);
  const checker = program.getTypeChecker();

  const sourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) => !sourceFile.isDeclarationFile && isProjectFile(sourceFile.fileName));

  // Two passes over the same files: the first needs to know every component
  // before the second can attribute a call site to one.
  const components = new Map<ts.Node, ComponentInfo>();
  for (const sourceFile of sourceFiles) collectComponents(sourceFile, checker, components);
  for (const sourceFile of sourceFiles) collectCallSites(sourceFile, checker, components);

  return report(components);
}

process.exitCode = main();
