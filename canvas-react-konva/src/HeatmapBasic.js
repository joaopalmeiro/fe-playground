import { extent } from 'd3-array';
import { scaleBand, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

import { chartDimensions, cellPadding } from './constants';
import { getUniqueValues } from './utils';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

const listenEvents = true;

export default function Heatmap({ data }) {
  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;

  const cellWidth = Math.max((chartDimensions.width - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((chartDimensions.height - cellPadding * (rows + 1)) / rows, 0);

  // Scales
  const xScale = scaleBand(xUniqueValues, [0, chartDimensions.width]);
  const yScale = scaleBand(yUniqueValues, [chartDimensions.height, 0]);
  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  return (
    <Stage
      width={chartDimensions.width}
      height={chartDimensions.height}
      draggable={false}
      listening={listenEvents}
    >
      <Layer>
        {data.map((d) => (
          <Rect
            key={`heatmap-rect-${xAccessor(d)}-${yAccessor(d)}`}
            x={xScale(xAccessor(d))}
            y={yScale(yAccessor(d))}
            width={cellWidth}
            height={cellHeight}
            fill={colorScale(colorAccessor(d))}
            listening={listenEvents}
          />
        ))}
      </Layer>
    </Stage>
  );
}
