import { textPropsByEngine } from '@nivo/core';
import React from 'react';

const tickSize = 5;
const tickPadding = 5;
// Tick rotation: https://github.com/plouc/nivo/blob/v0.73.1/packages/axes/src/compute.ts#L205

const textProps = textPropsByEngine['canvas'];

function Axis({ ctx, position, scale, width, height }) {
  const isXAxis = position === 'top' || position === 'bottom';
  const ticksPosition = position === 'top' || position === 'left' ? 'before' : 'after';

  const x = position === 'right' ? width : 0;
  const y = position === 'bottom' ? height : 0;

  const length = isXAxis ? width : height;

  // More info:
  // - https://github.com/d3/d3-scale#ordinal_domain
  // - https://github.com/plouc/nivo/blob/v0.73.1/packages/axes/src/compute.ts#L157
  const values = scale.domain(); // For `d3.scaleOrdinal()`

  const line = { lineX: 0, lineY: 0 };
  const text = { textX: 0, textY: 0 };

  // https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/lib/bridge.js
  let textAlign = textProps.align.center;
  let textBaseline = textProps.baseline.center;

  let translate;

  if (isXAxis) {
    // X-axis

    // Nullish coalescing operator (`??`)
    // `null` or `undefined`
    translate = (d) => ({ x: scale(d) ?? 0, y: 0 });

    line.lineY = tickSize * (ticksPosition === 'after' ? 1 : -1);
    text.textY = (tickSize + tickPadding) * (ticksPosition === 'after' ? 1 : -1);
  } else {
    // Y-Axis
    // TODO
  }

  return <div></div>;
}

export default Axis;
