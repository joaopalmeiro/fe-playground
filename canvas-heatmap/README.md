# canvas-heatmap

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

- Development: `yarn start`.
- Deployment: `yarn build`.

## References

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
  - `(...) ratio of pixel sizes: the size of one _CSS pixel_ to the size of one _physical pixel_.`
  - Use to correct the resolution in a `<canvas>`.
- [Setting Default Values with JavaScript’s Destructuring](https://wesbos.com/destructuring-default-values): default/fallback values and renaming (e.g., `const { middle: middleName = 'Super Rad' } = person;`).
- [Warning for 'exhaustive-deps' keeps asking for the full 'props' object instead of allowing single 'props' properties as dependencies](https://github.com/facebook/react/issues/16265) (open) issue.

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
