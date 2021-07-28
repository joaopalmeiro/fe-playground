import React from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { scaleBand, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { extent } from 'd3-array';
import { Html } from 'react-konva-utils';
import { AxisLeft, AxisTop } from '@visx/axis';

import { cellPadding } from './constants';
import { getUniqueValues } from './utils';
import { useDimensions } from './hooks';
import SvgWrapper from './SvgWrapper';

import './style.css';

// Accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const colorAccessor = (d) => d.value;

export default function HeatmapWithAxis({ data, fullWidth, fullHeight, partialMargin }) {
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
  // const yScale = scaleBand(yUniqueValues, [innerHeight, 0]);
  const yScale = scaleBand(yUniqueValues, [0, innerHeight]);

  const colorScale = scaleSequential(extent(data, colorAccessor), interpolateYlOrRd).nice();

  // SVG and Canvas as "layers":
  // - https://bl.ocks.org/veltman/1b43f61887e89c371f1c8c73341540a3

  // To add DOM elements inside Konva stage:
  // - https://konvajs.org/docs/react/DOM_Portal.html
  // - https://github.com/konvajs/react-konva-utils

  // More info:
  // - https://konvajs.org/api/Konva.Stage.html
  // - https://konvajs.org/docs/sandbox/SVG_On_Canvas.html
  return (
    <Stage width={outerWidth} height={outerHeight} draggable={false}>
      {/* More info: https://konvajs.org/docs/performance/Listening_False.html */}
      <Layer listening={true}>
        {/* Konva stage can only contain Konva layers. */}
        {/* All DOM elements are placed over the Canvas content. */}
        <Html>
          <SvgWrapper width={outerWidth} height={outerHeight} margin={margin}>
            <AxisLeft scale={yScale} left={-0.5} axisLineClassName="axis" />
            <AxisTop scale={xScale} top={-0.5} axisLineClassName="axis" />
          </SvgWrapper>
        </Html>
        <Group x={margin.left} y={margin.top}>
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
              // More info: https://konvajs.org/docs/performance/Disable_Perfect_Draw.html
              // Particularly useful if there is a stroke too.
              perfectDrawEnabled={false}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
}
