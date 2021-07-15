import { extent } from 'd3-array';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import React, { useRef, useEffect } from 'react';

import { cellPadding, chartDimensions } from './constants';
import { useDimensions } from './hooks';
import { getUniqueValues } from './utils';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

// Scale ranges
const computeX = (column, cellWidth, padding) => {
  return column * cellWidth + cellWidth * 0.5 + padding * column + padding;
};
const computeY = (row, cellHeight, padding) => {
  return row * cellHeight + cellHeight * 0.5 + padding * row + padding;
};

// Cells
const renderRect = (ctx, x, y, width, height) => {
  ctx.save();
};

export default function Heatmap({ data }) {
  // https://reactjs.org/docs/hooks-reference.html#useref
  const canvasEl = useRef(null); // useRef(initialValue);

  const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
    chartDimensions.width,
    chartDimensions.height
  );

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;

  const cellWidth = Math.max((innerWidth - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((innerHeight - cellPadding * (rows + 1)) / rows, 0);

  const scales = {
    x: scaleOrdinal(xUniqueValues.map((_, idx) => computeX(idx, cellWidth, cellPadding))).domain(
      xUniqueValues
    ),
    y: scaleOrdinal(yUniqueValues.map((_, idx) => computeY(idx, cellHeight, cellPadding))).domain(
      yUniqueValues
    ),
    // More info:
    // - https://github.com/d3/d3-scale/blob/main/src/sequential.js
    // - https://github.com/d3/d3-scale/blob/main/src/linear.js#L6
    color: scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice()
  };

  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
  }, []);

  return <canvas ref={canvasEl} width={chartDimensions.width} height={chartDimensions.height} />;
}
