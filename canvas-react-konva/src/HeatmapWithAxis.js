import React, { useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { scaleBand, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { extent } from 'd3-array';

import { cellPadding } from './constants';
import { getUniqueValues } from './utils';
import { useDimensions } from './hooks';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

export default function HeatmapWithAxis({ data, fullWidth, fullHeight, partialMargin }) {
  const canvasEl = useRef(null);

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

  const cellWidth = Math.max((innerWidth - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((innerHeight - cellPadding * (rows + 1)) / rows, 0);
  // console.log(cellWidth, cellHeight);

  // Scales
  // More info: https://github.com/d3/d3-scale#scaleBand
  const xScale = scaleBand(xUniqueValues, [0, innerWidth]);
  const yScale = scaleBand(yUniqueValues, [innerHeight, 0]);

  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  return (
    // More info: https://konvajs.org/api/Konva.Stage.html
    <Stage width={outerWidth} height={outerHeight} draggable={false} ref={canvasEl}>
      <Layer x={margin.left} y={margin.top}>
        {/* Example: https://konvajs.org/docs/react/index.html */}
        {data.map((d) => (
          // More info: https://konvajs.org/api/Konva.Rect.html
          // It is possible to attach any events that Konva supports to Canvas nodes.
          <Rect
            key={`heatmap-rect-${xAccessor(d)}-${yAccessor(d)}`}
            x={xScale(xAccessor(d))}
            y={yScale(yAccessor(d))}
            width={cellWidth}
            height={cellHeight}
            fill={colorScale(colorAccessor(d))}
          />
        ))}
      </Layer>
    </Stage>
  );
}
