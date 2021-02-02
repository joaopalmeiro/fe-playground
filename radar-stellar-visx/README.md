# radar-stellar-visx

**[Demo](https://radar-stellar-visx.netlify.app)**

An example of a Radar Chart and a [Stellar Chart](https://medium.com/nightingale/the-stellar-chart-an-elegant-alternative-to-radar-charts-ae6a6931a28e) created with [visx](https://github.com/airbnb/visx).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notes

- Boilerplate:
  - `yarn remove @testing-library/jest-dom @testing-library/react @testing-library/user-event web-vitals`.
  - Delete `"react-app/jest"` and `"test": "react-scripts test"` from the `package.json` file.
- `??` ([nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)):
  - It is a logical operator that returns its right-hand side operand when its left-hand side operand is `null` or `undefined`, and otherwise returns its left-hand side operand.

## References

- Alexandre Morin-Chassé's "[The Stellar Chart: An Elegant Alternative to Radar Charts](https://medium.com/nightingale/the-stellar-chart-an-elegant-alternative-to-radar-charts-ae6a6931a28e)" blog post.
- João Palmeiro's "[Stellar Chart, a Type of Chart to Be on Your Radar](https://matplotlib.org/matplotblog/posts/stellar-chart-alternative-radar-chart/)" blog post.
- "[Radar](https://airbnb.io/visx/radar)" example from [visx](https://github.com/airbnb/visx) documentation.
- "[ParentSize component increases svg's hight non-stop](https://github.com/airbnb/visx/issues/881)" issue.
- Chris Coyier's "[Emojis as Favicons](https://css-tricks.com/emojis-as-favicons/)" blog post.
- [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) page from MDN Web Docs.
