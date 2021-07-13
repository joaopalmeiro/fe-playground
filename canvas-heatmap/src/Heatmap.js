import React from 'react';

import { getUniqueValues } from './utils';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

export default function Heatmap({ data }) {
  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  return <div></div>;
}
