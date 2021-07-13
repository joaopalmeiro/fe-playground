import { range } from 'd3-array';

// More info:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
// - https://stackoverflow.com/a/43044960
// - https://mariusschulz.com/blog/returning-object-literals-from-arrow-functions-in-javascript
// - https://stackoverflow.com/a/23436563
// - https://flaviocopes.com/how-to-append-item-to-array/
export const genSquareMatrixData = (n) => {
  const indexes = range(n);
  const instances = [];

  for (const x of indexes) {
    for (const y of indexes) {
      instances.push({
        x: x,
        y: y,
        value: Math.random()
      });
    }
  }

  return instances;
};

export const getUniqueValues = (data, accessor) => [...new Set(data.map(accessor))];
