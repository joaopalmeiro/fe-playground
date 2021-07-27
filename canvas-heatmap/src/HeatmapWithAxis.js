import Tippy from '@tippyjs/react';
import { extent } from 'd3-array';
import { scaleOrdinal, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import React, { useRef, useEffect, useState, useCallback } from 'react';

import { axisCanvas } from './canvas';
import {
  cellPadding,
  hoverOpacity,
  hoverOthersOpacity,
  backgroundColor,
  pixelRatio,
  forceSquaredCells
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

export default function HeatmapWithAxis({ data, fullWidth, fullHeight, partialMargin }) {
  // https://reactjs.org/docs/hooks-reference.html#useref
  const canvasEl = useRef(null); // useRef(initialValue);

  // Tooltip
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const [currentCell, setCurrentCell] = useState(null);

  const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
    fullWidth,
    fullHeight,
    partialMargin
  );

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;
  // console.log(`Number of cells: ${rows * columns}`);

  // Another possibility is to set a default cell size and get the chart size from there
  let cellWidth = Math.max((innerWidth - cellPadding * (columns + 1)) / columns, 0);
  let cellHeight = Math.max((innerHeight - cellPadding * (rows + 1)) / rows, 0);

  // For squared cells
  // Source: https://github.com/plouc/nivo/blob/master/packages/heatmap/src/hooks.js#L108
  let offsetX = 0;
  let offsetY = 0;
  if (forceSquaredCells === true) {
    const cellSize = Math.min(cellWidth, cellHeight);

    cellWidth = cellSize;
    cellHeight = cellSize;

    // Another possibility is to ignore offsets and just use equal (cell) length and width
    offsetX = (innerWidth - ((cellWidth + cellPadding) * columns + cellPadding)) / 2;
    offsetY = (innerHeight - ((cellHeight + cellPadding) * rows + cellPadding)) / 2;
  }
  // console.log(offsetX, offsetY);

  // Scales
  const xScale = scaleOrdinal(
    xUniqueValues.map((_, idx) => computeX(idx, cellWidth, cellPadding))
  ).domain(xUniqueValues);

  const yScale = scaleOrdinal(
    yUniqueValues.map((_, idx) => computeY(idx, cellHeight, cellPadding))
  ).domain(yUniqueValues);

  // console.log(xScale.domain());
  // console.log(yScale.domain());
  // console.log('bandwidth' in xScale);

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
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;

    const ctx = canvasEl.current.getContext('2d');

    ctx.scale(pixelRatio, pixelRatio);

    // Required for dynamic opacity to work
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outerWidth, outerHeight);

    ctx.translate(margin.left + offsetX, margin.top + offsetY);

    // Axes
    // innerWidth -> innerWidth - offsetX * 2
    // innerHeight -> innerHeight - offsetY * 2
    axisCanvas(ctx, 'top', xScale, innerWidth - offsetX * 2, innerHeight - offsetY * 2);

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
    innerHeight,
    innerWidth,
    margin.left,
    margin.top,
    offsetX,
    offsetY,
    outerHeight,
    outerWidth,
    xScale,
    yScale
  ]);

  // Event handling
  const handleMouseHover = useCallback(
    (event) => {
      const [x, y] = getRelativeCursor(canvasEl.current, event);

      const cell = data.find((instance) =>
        isCursorInRect(
          xScale(xAccessor(instance)) + margin.left + offsetX - cellWidth / 2,
          yScale(yAccessor(instance)) + margin.top + offsetY - cellHeight / 2,
          cellWidth,
          cellHeight,
          x,
          y
        )
      );

      setCurrentCell(cell);
      show();
    },
    [cellHeight, cellWidth, data, margin.left, margin.top, offsetX, offsetY, xScale, yScale]
  );

  const handleMouseLeave = useCallback(() => {
    setCurrentCell(null);
    hide();
  }, []);

  // Source: https://github.com/plouc/nivo/blob/master/packages/heatmap/src/HeatMapCanvas.js
  return (
    <>
      <Tippy
        content={currentCell ? JSON.stringify(currentCell) : ''}
        visible={visible}
        reference={canvasEl}
        offset={getTooltipOffset(currentCell)}
      />

      <canvas
        ref={canvasEl}
        width={outerWidth * pixelRatio}
        height={outerHeight * pixelRatio}
        style={{
          width: outerWidth,
          height: outerHeight
        }}
        onMouseEnter={handleMouseHover}
        onMouseMove={handleMouseHover}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
}
