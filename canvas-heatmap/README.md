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
  - Check the configuration used: `./node_modules/.bin/eslint --print-config package.json`.
