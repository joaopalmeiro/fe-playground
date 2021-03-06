import { Group } from '@visx/group';
import { letterFrequency } from '@visx/mock-data';
import { Point } from '@visx/point';
import { scaleLinear } from '@visx/scale';
import { Line, LineRadial } from '@visx/shape';
import React from 'react';
import {
  defaultLevels,
  defaultMargin,
  degrees,
  orange,
  pumpkin,
  silver,
} from './constants.js';
import { genAngles, genPoints, range, round005 } from './utils.js';

const data = letterFrequency.slice(2, 12);
const y = (d) => d.frequency;

const genPolygonPoints = (dataArray, scale, getValue) => {
  const step = (Math.PI * 2) / dataArray.length;

  const points = new Array(dataArray.length).fill({
    x: 0,
    y: 0,
  });

  const pointString = new Array(dataArray.length + 1)
    .fill('')
    .reduce((accumulator, _, i) => {
      if (i > dataArray.length) return accumulator;

      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };

      accumulator += `${xVal},${yVal} `;

      return accumulator;
    });

  return { points, pointString };
};

function Radar({
  width,
  height,
  levels = defaultLevels,
  margin = defaultMargin,
  showPoints = false,
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
    // domain: [0, Math.max(...data.map(y))],
  });

  const yScaleTicks = range(...yScale.domain(), yScale.domain()[1] / levels);

  const webs = genAngles(data.length, degrees);
  const points = genPoints(data.length, radius);
  const zeroPoint = new Point({ x: 0, y: 0 });
  const polygonPoints = genPolygonPoints(data, (d) => yScale(d) ?? 0, y);

  return (
    <svg width={width} height={height}>
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
        {/* Labels */}
        {height >= 400 &&
          width >= 400 &&
          yScaleTicks.slice(1, yScaleTicks.length).map((tick, i) => (
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
        {/* Vertical lines of the web */}
        {[...new Array(data.length)].map((_, i) => (
          <Line
            key={`radar-line-${i}`}
            from={zeroPoint}
            to={points[i]}
            stroke={silver}
          />
        ))}
        <polygon
          points={polygonPoints.pointString}
          fill={orange}
          fillOpacity={0.3}
          stroke={orange}
          strokeWidth={1}
        />
        {showPoints &&
          polygonPoints.points.map((point, i) => (
            <circle
              key={`radar-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={pumpkin}
            />
          ))}
      </Group>
    </svg>
  );
}

export default Radar;
