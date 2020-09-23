# fe-playground

Some Front-End experiments with JavaScript-based technologies.

## Notes

- Next.js:
  - `pages/index.js`: Entry point.
  - Routes are based on the file system.
  - `pages` are just React components.
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
