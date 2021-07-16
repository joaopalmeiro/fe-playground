import Tippy from '@tippyjs/react';
import { extent } from 'd3-array';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
// import randomColor from 'randomcolor';
import React, { useRef, useEffect, useState, useCallback } from 'react';

import {
  cellPadding,
  chartDimensions,
  hoverOpacity,
  hoverOthersOpacity,
  backgroundColor
} from './constants';
import { useDimensions } from './hooks';
import { getUniqueValues, getRelativeCursor, isCursorInRect } from './utils';

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

// Opacity
const rowColumn = (cell, currentCell) => cell.x === currentCell.x || cell.y === currentCell.y;

const getOpacity = (cell, currentCell, hoverFn) => {
  if (currentCell) {
    return hoverFn(cell, currentCell) ? hoverOpacity : hoverOthersOpacity;
  }

  return hoverOpacity;
};

export default function Heatmap({ data }) {
  // https://reactjs.org/docs/hooks-reference.html#useref
  const canvasEl = useRef(null); // useRef(initialValue);

  // Tooltip
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

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

  const getTooltipOffset = (currentCell) => {
    if (currentCell) {
      return [xScale(xAccessor(currentCell)), yScale(yAccessor(currentCell))];
    }

    return [0, 10]; // Default
  };

  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');

    // Required for dynamic opacity to work
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outerWidth, outerHeight);

    ctx.translate(margin.left, margin.top);

    // console.log(currentCell);
    data.forEach((instance) =>
      renderRect(
        ctx,
        xScale(xAccessor(instance)),
        yScale(yAccessor(instance)),
        cellWidth,
        cellHeight,
        colorScale(colorAccessor(instance)),
        getOpacity(instance, currentCell, rowColumn)
      )
    );
  }, [
    cellHeight,
    cellWidth,
    colorScale,
    currentCell,
    data,
    margin.left,
    margin.top,
    outerHeight,
    outerWidth,
    xScale,
    yScale
  ]);
  // `margin.left, margin.top` or `margin`

  // Event handling
  const handleMouseHover = useCallback(
    (event) => {
      const [x, y] = getRelativeCursor(canvasEl.current, event);

      const cell = data.find((instance) =>
        isCursorInRect(
          xScale(xAccessor(instance)) + margin.left - cellWidth / 2,
          yScale(yAccessor(instance)) + margin.top - cellHeight / 2,
          cellWidth,
          cellHeight,
          x,
          y
        )
      );

      setCurrentCell(cell);
      show();
    },
    [cellHeight, cellWidth, data, margin.left, margin.top, xScale, yScale]
  );

  const handleMouseLeave = useCallback(() => {
    setCurrentCell(null);
    hide();
  }, []);

  // Source: https://github.com/plouc/nivo/blob/master/packages/heatmap/src/HeatMapCanvas.js
  return (
    <>
      <Tippy
        content={JSON.stringify(currentCell)}
        visible={visible}
        reference={canvasEl}
        offset={getTooltipOffset(currentCell)}
      />

      <canvas
        ref={canvasEl}
        width={outerWidth}
        height={outerHeight}
        onMouseEnter={handleMouseHover}
        onMouseMove={handleMouseHover}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
}
