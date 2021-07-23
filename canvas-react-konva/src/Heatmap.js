import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

import { chartDimensions } from './constants';

export default function Heatmap({ data }) {
  console.log(data);

  return (
    <Stage width={chartDimensions.width} height={chartDimensions.height}>
      <Layer>
        <Rect x={20} y={50} width={100} height={100} fill="red" />
      </Layer>
    </Stage>
  );
}
