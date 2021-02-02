import { Group } from '@visx/group';
import { letterFrequency } from '@visx/mock-data';
import { Point } from '@visx/point';
import { scaleLinear } from '@visx/scale';
import { Line, LineRadial } from '@visx/shape';
import React from 'react';
import {
  background,
  defaultLevels,
  defaultMargin,
  degrees,
  orange,
  silver,
} from './constants.js';
import { genAngles, genPoints, range, round005 } from './utils.js';

const data = letterFrequency.slice(2, 12);
const y = (d) => d.frequency;

const genPolygonPoints = (dataArray, scale, getValue) => {
  const step = (Math.PI * 2) / dataArray.length;

  const midstep = Math.PI / dataArray.length;
  const midvalue = 0.05 * Math.max(...dataArray.map(getValue));

  const pointString = new Array(dataArray.length + 1)
    .fill('')
    .reduce((accumulator, _, i) => {
      if (i > dataArray.length) return accumulator;

      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);

      const xMidVal = scale(midvalue) * Math.sin(i * step + midstep);
      const yMidVal = scale(midvalue) * Math.cos(i * step + midstep);

      accumulator += `${xVal},${yVal} ${xMidVal},${yMidVal} `;

      return accumulator;
    });

  return pointString;
};

function Example({
  width,
  height,
  levels = defaultLevels,
  margin = defaultMargin,
}) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear({
    range: [0, Math.PI * 2],
    domain: [degrees, 0],
  });

  const yScale = scaleLinear({
    range: [0, radius],
    domain: [0, round005(Math.max(...data.map(y)))],
  });

  const yScaleTicks = range(...yScale.domain(), yScale.domain()[1] / levels);

  const webs = genAngles(data.length, degrees);
  const points = genPoints(data.length, radius);
  const zeroPoint = new Point({ x: 0, y: 0 });
  const polygonPoints = genPolygonPoints(data, (d) => yScale(d) ?? 0, y);

  return (
    <svg width={width} height={height}>
      <rect fill={background} width={width} height={height} rx={14} />
      <Group top={height / 2 - margin.top} left={width / 2}>
        {[...new Array(levels)].map((_, i) => (
          <LineRadial
            key={`web-${i}`}
            data={webs}
            angle={(d) => radialScale(d.angle) ?? 0}
            radius={((i + 1) * radius) / levels}
            fill="none"
            stroke={silver}
            strokeWidth={2}
            strokeOpacity={0.8}
            strokeLinecap="round"
          />
        ))}
        {/** Labels */}
        {yScaleTicks.slice(1, yScaleTicks.length).map((tick, i) => (
          <text
            key={`radial-grid-${i}`}
            y={-(yScale(tick) ?? 0)}
            dy="-.33em"
            dx=".33em"
            fontSize={8}
            fill={silver}
            textAnchor="start"
          >
            {tick}
          </text>
        ))}
        {[...new Array(data.length)].map((_, i) => (
          <Line
            key={`stellar-line-${i}`}
            from={zeroPoint}
            to={points[i]}
            stroke={silver}
          />
        ))}
        <polygon
          points={polygonPoints}
          fill={orange}
          fillOpacity={1}
          stroke={orange}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        <circle cx={zeroPoint.x} cy={zeroPoint.y} r={2} fill={'white'} />
      </Group>
    </svg>
  );
}

export default Example;
