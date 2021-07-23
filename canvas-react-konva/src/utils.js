import { range } from 'd3-array';

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
