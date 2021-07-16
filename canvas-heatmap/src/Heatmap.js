import { extent } from 'd3-array';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
// import randomColor from 'randomcolor';
import React, { useRef, useEffect, useState } from 'react';

import { cellPadding, chartDimensions, opacity } from './constants';
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
// Source: https://github.com/plouc/nivo/blob/master/packages/heatmap/src/canvas.js
const renderRect = (ctx, x, y, width, height, color, opacity) => {
  ctx.save();

  ctx.globalAlpha = opacity;

  // ctx.fillStyle = randomColor();
  ctx.fillStyle = color;

  // Syntax: `ctx.fillRect(x, y, width, height)`
  // `x`: The X-axis coordinate of the rectangle's starting point
  // `y`: The Y-axis coordinate of the rectangle's starting point
  ctx.fillRect(x - width / 2, y - height / 2, width, height);

  ctx.restore();
};

export default function Heatmap({ data }) {
  // https://reactjs.org/docs/hooks-reference.html#useref
  const canvasEl = useRef(null); // useRef(initialValue);

  // TODO
  const [currentCell, setCurrentCell] = useState(null);

  const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
    chartDimensions.width,
    chartDimensions.height
  );

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;
  // console.log(`Number of cells: ${rows * columns}`);

  const cellWidth = Math.max((innerWidth - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((innerHeight - cellPadding * (rows + 1)) / rows, 0);

  // Scales
  const xScale = scaleOrdinal(
    xUniqueValues.map((_, idx) => computeX(idx, cellWidth, cellPadding))
  ).domain(xUniqueValues);

  const yScale = scaleOrdinal(
    yUniqueValues.map((_, idx) => computeY(idx, cellHeight, cellPadding))
  ).domain(yUniqueValues);

  // More info:
  // - https://github.com/d3/d3-scale/blob/main/src/sequential.js
  // - https://github.com/d3/d3-scale/blob/main/src/linear.js#L6
  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');

    ctx.translate(margin.left, margin.top);

    data.forEach((instance) =>
      renderRect(
        ctx,
        xScale(xAccessor(instance)),
        yScale(yAccessor(instance)),
        cellWidth,
        cellHeight,
        colorScale(colorAccessor(instance)),
        opacity
      )
    );
  }, [cellHeight, cellWidth, colorScale, data, margin.left, margin.top, xScale, yScale]); // or `margin`

  return <canvas ref={canvasEl} width={outerWidth} height={outerHeight} />;
}
