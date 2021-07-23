# canvas-react-konva

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Heatmap implemented in Canvas via [Konva](https://konvajs.org/) for learning purposes.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

- Development: `yarn start`.
- Deployment: `yarn build`.

## Notes

- [npm-package-json-lint](https://npmpackagejsonlint.org/):
  - A linter for `package.json` files.
  - It does not have any rules enabled by default.
  - `yarn add -D npm-package-json-lint`.
  - `npmPkgJsonLint .`.
  - [Rules](https://npmpackagejsonlint.org/docs/en/rules).
  - [`package.json` documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) ([Yarn 1](https://classic.yarnpkg.com/en/docs/package-json/)).
  - [Default `prefer-property-order`](https://npmpackagejsonlint.org/docs/en/rules/package-json-properties/prefer-property-order).
- [sort-package-json](https://github.com/keithamus/sort-package-json):
  - `yarn add -D sort-package-json`.
  - [Default ordering](https://github.com/keithamus/sort-package-json/blob/master/defaultRules.md).
  - [Script not sorting in 1.49.0](https://github.com/keithamus/sort-package-json/issues/220) (open) issue.
  - [Sorting `scripts` only by pre/post criteria](https://github.com/keithamus/sort-package-json/releases/tag/v1.49.0) from v1.49.0 ([discussion](https://github.com/keithamus/sort-package-json/pull/206)). Alternative: `yarn add -D sort-package-json@1.48`.
- [validator.js](https://github.com/validatorjs/validator.js) package.
- [Create-React-App build - “Uncaught SyntaxError: Unexpected token <”](https://stackoverflow.com/questions/54340240/create-react-app-build-uncaught-syntaxerror-unexpected-token) and [Using `“homepage”` in package.json, without messing up paths for localhost](https://stackoverflow.com/questions/43011207/using-homepage-in-package-json-without-messing-up-paths-for-localhost) threads.
  - Easy solution: don't specify `homepage` in the `package.json` file.
- [Auth0](https://auth0.com/) and [@auth0/auth0-react](https://github.com/auth0/auth0-react/) ([tutorial](https://youtu.be/MqczHS3Z2bc)).
- [react-json-pretty](https://www.npmjs.com/package/react-json-pretty) package.
- [Konva](https://konvajs.org/):
  - Canvas library.
  - [react-konva](https://konvajs.org/docs/react/Intro.html):
    - `npm install react-konva konva`.
    - [Repo](https://github.com/konvajs/react-konva).
    - [react-konva-utils](https://www.npmjs.com/package/react-konva-utils).
    - [@react-spring/konva](https://www.npmjs.com/package/@react-spring/konva): it is possible to combine react-konva and [react-spring](https://react-spring.io/) ([example](https://konvajs.org/docs/react/Complex_Animations.html)).
  - Stage > Layer(s) > Groups and/or Shapes.
  - Stage: `<div>` wrapper.
  - Layer: 2D `<canvas>` element.
  - Each layer has two `<canvas>` renderers: a _scene renderer_ (visible) and a _hit graph renderer_ (hidden and used for high-performance event detection).
  - The Stage, Layers, Groups, and Shapes are _virtual nodes_. They can be styled and transformed.
  - Performance (more tips [here](https://konvajs.org/docs/performance/All_Performance_Tips.html)): it supports shape caching and layering. Regarding layering, it is possible to use one layer for (static) background and another one for (moving) shapes, for example.
  - `react-konva` vs. (vanilla) Canvas ([source](https://konvajs.org/docs/react/index.html)): Canvas can be faster since `react-konva` comes with two layers of abstractions: (1) `Konva`is on top of Canvas and (2) React is on top of `Konva`. For many applications, its performance is still good.
  - [`Rect` shape](https://konvajs.org/docs/shapes/Rect.html) ([example](https://konvajs.org/docs/react/Shapes.html)).
- [bundle-phobia-cli](https://github.com/AdrieanKhisbe/bundle-phobia-cli) + [bundlephobia](https://bundlephobia.com/):
  - `bundle-phobia react-konva@17.0.2-5 konva@8.1.1` (`--json` flag):
    - `react-konva` ([17.0.2-5](https://bundlephobia.com/package/react-konva@17.0.2-5)) has 2 dependencies for a weight of 93.97KB (29.46KB gzipped).
    - `konva` ([8.1.1](https://bundlephobia.com/package/konva@8.1.1)) has 0 dependencies for a weight of 151.57KB (43.52KB gzipped).
    - **total** (2 packages) has 2 dependencies for a weight of 245.54KB (72.98KB gzipped).
  - API: `https://bundlephobia.com/api/size?package=react-konva@17.0.2-5`.
  - The download time computation uses the "Minified + Gzipped" value (more info [here](https://github.com/pastelsky/bundlephobia/blob/bundlephobia/pages/package/%5B...packageString%5D/ResultPage.js#L371) and [here](https://github.com/pastelsky/bundlephobia/blob/bundlephobia/utils/index.js#L46)).

### Download Time Computation (bundlephobia)

```javascript
const DownloadSpeed = {
  THREE_G: 400, // Slow 3G
  FOUR_G: 7000 // 4G
};

const getTimeFromSize = (sizeInBytes) => {
  return {
    threeG: sizeInBytes / 1024 / DownloadSpeed.THREE_G,
    fourG: sizeInBytes / 1024 / DownloadSpeed.FOUR_G
  };
};
```
