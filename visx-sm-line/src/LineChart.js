import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { curveLinear } from '@visx/curve';
import { Group } from '@visx/group';
import { scaleLinear, scalePoint } from '@visx/scale';
import { LinePath } from '@visx/shape';
import Theme from './Theme';

export default function LineChart({
  data,
  xvar,
  yvar,
  breakdown,
  lineToHighlight,
  width = 300,
  height = 300,
  margin = { top: 40, right: 30, bottom: 50, left: 40 },
  showYAxis = true,
  mirrorYAxis = false,
}) {
  // Accessors
  const xAccessor = (d) => d[xvar];
  const yAccessor = (d) => Number(d[yvar].replace(/,/g, '.'));
  const colorAccessor = (d) => d[breakdown];

  // Bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Unique values
  const xValues = new Set(data.map(xAccessor));
  const colorValuesBackground = new Set(data.map(colorAccessor));
  colorValuesBackground.delete(lineToHighlight);

  // Scales
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [
      // Math.min(...data.map(yAccessor)),
      0,
      Math.max(...data.map(yAccessor)),
    ],
    nice: true,
  });

  const xScale = scalePoint({
    range: [0, xMax],
    domain: xValues,
    padding: 0,
  });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <AxisBottom
          top={yMax}
          scale={xScale}
          stroke={Theme.axisColor}
          tickStroke={Theme.axisColor}
          tickLabelProps={() => ({
            // Default values: https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisBottom.tsx.
            dy: '0.25em',
            fill: Theme.axisColor,
            fontFamily: 'Arial',
            fontSize: 10,
            textAnchor: 'middle',
          })}
        />
        {showYAxis &&
          (mirrorYAxis ? (
            <AxisRight left={xMax + 5} scale={yScale} numTicks={5} />
          ) : (
            <AxisLeft left={-5} scale={yScale} numTicks={5} />
          ))}

        {[...colorValuesBackground].map((color) => {
          const dataToPlot = data.filter((d) => colorAccessor(d) === color);

          return (
            <LinePath
              key={`${lineToHighlight}-line-${color}`}
              data={dataToPlot}
              curve={curveLinear}
              x={(d) => xScale(xAccessor(d))}
              y={(d) => yScale(yAccessor(d))}
              stroke={Theme.backgroundLine}
              strokeWidth={1}
            />
          );
        })}

        {/* To ensure that the highlighted line is drawn on top of the others. */}
        <LinePath
          key={`${lineToHighlight}-line-${lineToHighlight}`}
          data={data.filter((d) => colorAccessor(d) === lineToHighlight)}
          curve={curveLinear}
          x={(d) => xScale(xAccessor(d))}
          y={(d) => yScale(yAccessor(d))}
          stroke={Theme.highlightLine}
          strokeWidth={1.5}
        />
      </Group>
    </svg>
  );
}
