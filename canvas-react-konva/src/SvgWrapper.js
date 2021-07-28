import React from 'react';

// Source: https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/components/SvgWrapper.js
function SvgWrapper({ width, height, margin, children }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
    </svg>
  );
}

export default SvgWrapper;
