# canvas-heatmap

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Heatmap implemented in Canvas for learning purposes. Adapted from the [nivo](https://nivo.rocks/) library.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

- Development: `yarn start`.
- Deployment: `yarn build`.

## References

- [nivo](https://nivo.rocks/) library.
- Lucas Miranda's [Canvas with React.js](https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258) blog post.

## Notes

- [faker.js](https://github.com/Marak/faker.js):
  - [Documentation](http://marak.github.io/faker.js/).
  - [generate an array of N items?](https://github.com/Marak/faker.js/issues/399) (open) issue.
- [mocker-data-generator](https://github.com/danibram/mocker-data-generator) (to create multiple instances easily):
  - [Demo](https://danibram.github.io/mocker-data-generator/).
- [@visx/mock-data](https://github.com/airbnb/visx/tree/master/packages/visx-mock-data).
- [Adding scaleSequential to @visx/scale](https://github.com/airbnb/visx/issues/953) (open) issue.
- ESLint + CRA:
  - [Extending or replacing the default ESLint config](https://create-react-app.dev/docs/setting-up-your-editor/#extending-or-replacing-the-default-eslint-config).
  - [import/order: Enforce a convention in module import order](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md) ([eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)).
  - Check the configuration used ([source](https://eslint.org/docs/user-guide/command-line-interface#options)): `./node_modules/.bin/eslint --print-config package.json`.
- [Linguist](https://github.com/github/linguist):
  - [Supported languages](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml).
  - [Syntax highlighting documentation](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#syntax-highlighting).
  - [Highlighting React Code in GitHub Flavored Markdown](https://www.pluralsight.com/guides/highlight-react-in-github-markdown): `javascript` or `jsx`.
- [Window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):
  - `(...) ratio of pixel sizes: the size of one CSS pixel to the size of one physical pixel.`
  - Use to correct the resolution in a `<canvas>`.
- [Setting Default Values with JavaScript’s Destructuring](https://wesbos.com/destructuring-default-values): default/fallback values and renaming (e.g., `const { middle: middleName = 'Super Rad' } = person;`).
- [Warning for 'exhaustive-deps' keeps asking for the full 'props' object instead of allowing single 'props' properties as dependencies](https://github.com/facebook/react/issues/16265) (open) issue.
- [gitmoji](https://gitmoji.dev/):
  - Emojis for commit messages.
  - `yarn add --dev gitmoji-cli`.
  - [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli):
    - Print all available options: `gitmoji -l` (or `yarn emojis`).
- [CanvasRenderingContext2D.save()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save).
- [textPropsByEngine](https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/lib/bridge.js).
- [Slides](https://github.com/maaslalani/slides):
  - To create slide decks and show them in the terminal.
  - `brew install slides`.
  - `slides presentation.md`.
- [Canvas scatterplot with quadtree](https://bl.ocks.org/veltman/1b43f61887e89c371f1c8c73341540a3).
- [Profiler API](https://reactjs.org/docs/profiler.html).
- [Before You memo()](https://overreacted.io/before-you-memo/) blog post:
  - Before applying memoization, try to _move state down_ (create a new component and use it in a wrapper component) or _lift content up_ (`children` prop). In other words, try to separate the parts that change from the parts that don’t change.

**Canvas component snippet**:

```jsx
import React, { useRef, useEffect } from 'react';

const Canvas = (props) => {
  const canvasRef = useRef(null);

  // It could be a prop.
  const draw = (ctx) => {
    // ...
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
```
