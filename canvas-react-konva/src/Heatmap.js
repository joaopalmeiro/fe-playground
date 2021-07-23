import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
// import Konva from 'konva';
import { scaleBand, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { extent } from 'd3-array';

import { chartDimensions, cellPadding } from './constants';
import { getUniqueValues } from './utils';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

export default function Heatmap({ data }) {
  // console.log(data);

  const xUniqueValues = getUniqueValues(data, xAccessor);
  const yUniqueValues = getUniqueValues(data, yAccessor);

  const columns = xUniqueValues.length;
  const rows = yUniqueValues.length;
  // console.log(`Number of cells: ${rows * columns}`);

  const cellWidth = Math.max((chartDimensions.width - cellPadding * (columns + 1)) / columns, 0);
  const cellHeight = Math.max((chartDimensions.height - cellPadding * (rows + 1)) / rows, 0);
  // console.log(cellWidth, cellHeight);

  // Scales
  // More info: https://github.com/d3/d3-scale#scaleBand
  const xScale = scaleBand(xUniqueValues, [0, chartDimensions.width]);
  const yScale = scaleBand(yUniqueValues, [chartDimensions.height, 0]);

  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  // console.log(`heatmap-rect-${xAccessor(data[0])}-${yAccessor(data[0])}`);

  const handleMouseHover = (e) => {
    // console.log(e);
    console.log(e.target);
    // console.log(e.currentTarget);

    // Stage.
    // More info: https://stackoverflow.com/a/50809160
    // console.log(e.target.getStage());
    // console.log(e.target.getStage().getPointerPosition());
  };

  return (
    // More info: https://konvajs.org/api/Konva.Stage.html
    <Stage width={chartDimensions.width} height={chartDimensions.height} draggable={false}>
      <Layer>
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
            // fill={Konva.Util.getRandomColor()}
            fill={colorScale(colorAccessor(d))}
            // onMouseEnter={handleMouseHover}
          />
        ))}
      </Layer>
    </Stage>
  );
}
