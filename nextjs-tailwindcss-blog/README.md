# nextjs-tailwindcss-blog

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Quickstart

- `yarn dev`.

## Notes

- Create a project: `npx create-next-app --example with-tailwindcss nextjs-tailwindcss-blog`.
- PostCSS:
  - [PostCSS Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes) (plugin):
    - `yarn remove postcss-flexbugs-fixes`.
  - [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env) (plugin):
    - [cssdb](https://cssdb.org/#staging-process) ([IDs](https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js#L36)).
  - [Autoprefixer](https://github.com/postcss/autoprefixer) (plugin):
    - Add prefixes only for the final and IE [10](https://github.com/postcss/autoprefixer/issues/1193) versions of the flexbox specification: `flexbox: "no-2009"`.
  - _[Customizing PostCSS Config](https://nextjs.org/docs/advanced-features/customizing-postcss-config)_ page (Next.js).
  - In Next.js, plugins must be provided as strings (there is no need to import them).
- [Browserslist](https://github.com/browserslist/browserslist):
  - Check the list of browsers to target: `npx browserslist "last 1 version, >1%"`.
  - Check the list of browsers selected by the queries from the project directory: `npx browserslist`.
  - `,` works as `or`.
  - _ESR_ stands for _Extended Support Release_ (Firefox).
- Tailwind CSS:
  - [IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VS Code extension).
- Next.js:
  - `pages/index.js`: Entry point.
  - Routes are based on the file system.
  - `pages` are just React components.
  - The `next-env.d.ts` file allows Next.js types to be picked up by the TypeScript compiler.
- TypeScript:
  - `yarn add --dev typescript @types/react @types/node`.
  - `tsconfig.json`:
    - `"strict": true`.
    - `"strictNullChecks": true`.
- Install [Emotion](https://emotion.sh/docs/introduction) (CSS-in-JS): `yarn add @emotion/styled @emotion/core`.
- [JSON Placeholder API](https://jsonplaceholder.typicode.com/posts).
- [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) (VS Code extension).
- [Open Graph protocol](https://ogp.me/).
- [Netlify Forms](https://www.netlify.com/products/forms/).
- VS Code:
  - _[Custom Data for CSS Language Service](https://github.com/Microsoft/vscode-css-languageservice/blob/master/docs/customData.md)_ page. It is necessary to reload VS Code to apply the changes.
    - The `@apply` directive was not added to the `tailwind.css-data.json` file because it is declared at the CSS property level. The CSS Language Service probably does not expect `atDirectives` at this level and will not pick up such directives ([source](https://stackoverflow.com/questions/47607602/how-to-add-a-tailwind-css-rule-to-css-checker)).

## Snippets

**Next.js types**:

```js
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
};

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
};
```

```js
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
```
