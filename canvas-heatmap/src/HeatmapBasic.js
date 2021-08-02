import { extent } from 'd3-array';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import React, { useRef, useEffect } from 'react';

import { cellPadding, chartDimensions, backgroundColor, pixelRatio } from './constants';
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
const renderRect = (ctx, x, y, width, height, color) => {
  ctx.save();

  ctx.globalAlpha = 1;
  ctx.fillStyle = color;

  ctx.fillRect(x - width / 2, y - height / 2, width, height);

  ctx.restore();
};

export default function HeatmapBasic({ data }) {
  // const now = performance.now();
  // while (performance.now() - now < 3000) {}

  const canvasEl = useRef(null);

  // Dimensions
  const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
    chartDimensions.width,
    chartDimensions.height
  );

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;

  // Cell size
  const cellWidth = Math.max((innerWidth - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((innerHeight - cellPadding * (rows + 1)) / rows, 0);

  // Scales
  const xScale = scaleOrdinal(
    xUniqueValues.map((_, idx) => computeX(idx, cellWidth, cellPadding))
  ).domain(xUniqueValues);
  const yScale = scaleOrdinal(
    yUniqueValues.map((_, idx) => computeY(idx, cellHeight, cellPadding))
  ).domain(yUniqueValues);
  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  // Canvas chart
  useEffect(() => {
    // Artificial delay (do nothing for 3000ms)
    // 1000ms == 1s
    // Source:
    // - https://overreacted.io/before-you-memo/
    // - https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
    // const now = performance.now();
    // while (performance.now() - now < 3000) {}

    // const t0 = performance.now();

    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;

    const ctx = canvasEl.current.getContext('2d');

    ctx.scale(pixelRatio, pixelRatio);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outerWidth, outerHeight);

    ctx.translate(margin.left, margin.top);

    data.forEach((instance) =>
      renderRect(
        ctx,
        xScale(xAccessor(instance)),
        yScale(yAccessor(instance)),
        cellWidth,
        cellHeight,
        colorScale(colorAccessor(instance))
      )
    );

    // const t1 = performance.now();
    // console.log(`${t1 - t0} milliseconds`);
  }, [
    cellHeight,
    cellWidth,
    colorScale,
    data,
    margin.left,
    margin.top,
    outerHeight,
    outerWidth,
    xScale,
    yScale
  ]);

  return (
    <canvas
      ref={canvasEl}
      width={outerWidth * pixelRatio}
      height={outerHeight * pixelRatio}
      style={{
        width: outerWidth,
        height: outerHeight
      }}
    />
  );
}
