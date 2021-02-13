import { AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { letterFrequency as data } from '@visx/mock-data';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { format } from 'd3-format';
import React, { useMemo } from 'react';

const verticalMargin = 120;
const horizontalMargin = 30;

const background = '#ecf4f3';
const bar = '#006a71';

// Accessors
const getLetter = (d) => d.letter;
// const getLetterFrequency = (d) => Number(d.frequency) * 100;
const getLetterFrequency = (d) => d.frequency;

function Example({ width, height }) {
  // Bounds
  const xMax = width - horizontalMargin;
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
      <rect width={width} height={height} fill={background} rx={14} />
      <Group left={horizontalMargin / 2} top={verticalMargin / 2}>
        {data.map((d) => {
          const letter = getLetter(d);
          const letterFrequency = getLetterFrequency(d);

          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(letterFrequency) ?? 0);

          const barX = xScale(letter);
          const barY = yMax - barHeight;

          return (
            <React.Fragment key={`labeled-bar-${letter}`}>
              <Bar
                key={`bar-${letter}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={bar}
              />
              <text
                key={`text-label-${letter}`}
                x={barX}
                y={barY}
                dx={barWidth / 2}
                dy="-.25em"
                fontSize={8}
                textAnchor="middle"
              >
                {/* Breakpoint: https://tailwindcss.com/docs/breakpoints */}
                {format(width >= 640 ? '.2~%' : '.0%')(letterFrequency)}
              </text>
            </React.Fragment>
          );
        })}
        {/* Default values: https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisBottom.tsx */}
        <AxisBottom
          scale={xScale}
          label="Letter (English)"
          top={yMax}
          numTicks={data.length}
        />
      </Group>
    </svg>
  );
}

export default Example;
