import { Group } from '@visx/group';
import { letterFrequency } from '@visx/mock-data';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import React, { useMemo } from 'react';

const data = letterFrequency.slice(5);
const verticalMargin = 120;

// Accessors
const getLetter = (d) => d.letter;
const getLetterFrequency = (d) => Number(d.frequency) * 100;

function Example({ width, height }) {
  // Bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  // Scales (memoize for performance)
  // More info: https://observablehq.com/@d3/d3-scaleband
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        // round: true,
        domain: data.map(getLetter),
        padding: 0.4,
      }),
    [xMax]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        // round: true,
        domain: [0, Math.max(...data.map(getLetterFrequency))],
      }),
    [yMax]
  );

  return (
    <svg width={width} height={height}>
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const letter = getLetter(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0);
          const barX = xScale(letter);
          const barY = yMax - barHeight;

          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="#3b6978"
            />
          );
        })}
      </Group>
    </svg>
  );
}

export default Example;
