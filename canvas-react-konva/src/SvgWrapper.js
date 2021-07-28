import React from 'react';

import { defaultMargin } from './constants';

// Source: https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/components/SvgWrapper.js
function SvgWrapper({ width, height, children, margin = defaultMargin, overflow = 'auto' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      overflow={overflow}
      width={width}
      height={height}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
    </svg>
  );
}

export default SvgWrapper;
