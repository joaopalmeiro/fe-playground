import React, { useRef } from 'react';

import { defaultDimensions } from './constants';
import { getUniqueValues } from './utils';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

export default function Heatmap({ data }) {
  // https://reactjs.org/docs/hooks-reference.html#useref
  const canvasEl = useRef(null); // useRef(initialValue);

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  return (
    <canvas ref={canvasEl} width={defaultDimensions.width} height={defaultDimensions.height} />
  );
}
