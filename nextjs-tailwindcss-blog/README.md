# nextjs-tailwindcss-blog

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Quickstart

- `yarn dev`.

## Notes

- `npx create-next-app --example with-tailwindcss nextjs-tailwindcss-blog`.
- PostCSS:
  - [PostCSS Flexbugs Fixes](https://github.com/luisrudge/postcss-flexbugs-fixes) (plugin):
    - `yarn remove postcss-flexbugs-fixes`.
  - [PostCSS Preset Env](https://github.com/csstools/postcss-preset-env):
    - [cssdb](https://cssdb.org/#staging-process) ([IDs](https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js#L36)).
  - [Autoprefixer](https://github.com/postcss/autoprefixer) (plugin):
    - Add prefixes only for the final and IE [10](https://github.com/postcss/autoprefixer/issues/1193) versions of the flexbox specification: `flexbox: "no-2009"`.
  - _[Customizing PostCSS Config](https://nextjs.org/docs/advanced-features/customizing-postcss-config)_ page (Next.js).
  - In Next.js, plugins must be provided as strings (there is no need to import them).
- [Browserslist](https://github.com/browserslist/browserslist):
  - Check the list of browsers to target: `npx browserslist "last 1 version, >1%"`.
  - Check the list of browsers selected by the queries from the project directory: `npx browserslist`.
  - `,` works as `or`.
  - _ESR_ stands for _Extended Support Release_.
- Tailwind CSS:
  - [IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VS Code extension).
