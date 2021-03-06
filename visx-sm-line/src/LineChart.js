import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { curveLinear } from '@visx/curve';
import { Group } from '@visx/group';
import { scaleLinear, scalePoint } from '@visx/scale';
import { LinePath, Circle } from '@visx/shape';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import Theme from './Theme';
import PieChart from './PieChart';

const getObjectWithMax = (data, accessor) =>
  data.reduce((prev, current) =>
    accessor(prev) > accessor(current) ? prev : current
  );

// Default values:
// - https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisRenderer.tsx
// - https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisBottom.tsx
const tickLength = 8;
const strokeWidth = 1 / 2;
const fontSize = 10 + 1;
const dy = 0.25 * 10;
const bottomMargin = strokeWidth + tickLength + fontSize + dy;

const titleFontSize = 16; // .f5 -> 1 rem
const topMargin = titleFontSize;

const singleMargin = Math.max(30, bottomMargin, topMargin);

// const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };
const defaultMargin = {
  top: singleMargin,
  right: singleMargin,
  bottom: singleMargin,
  left: singleMargin,
};

export default function LineChart({
  data,
  xvar,
  yvar,
  breakdown,
  lineToHighlight,
  cvar,
  mainCategory,
  width = 300,
  height = 300,
  margin = defaultMargin,
  showYAxis = true,
  mirrorYAxis = false,
  showHelp = false,
}) {
  // Tooltip
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: false,
    scroll: true,
  });

  // Accessors
  const xAccessor = (d) => d[xvar];
  const yAccessor = (d) => Number(d[yvar].replace(/,/g, '.'));
  const colorAccessor = (d) => d[breakdown];
  const categoryAccessor = (d) => d[cvar];

  // Bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Data subsets
  const mainData = data.filter((d) => categoryAccessor(d) === mainCategory);
  const categoryData = data.filter((d) => categoryAccessor(d) !== mainCategory);
  const dataToHighlight = mainData.filter(
    (d) => colorAccessor(d) === lineToHighlight
  );

  // Unique values
  const xValues = new Set(data.map(xAccessor));
  const colorValuesBackground = new Set(data.map(colorAccessor));
  colorValuesBackground.delete(lineToHighlight);
  const maxX = xAccessor(getObjectWithMax(dataToHighlight, yAccessor));

  // Scales
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [
      // Math.min(...mainData.map(yAccessor)),
      0,
      Math.max(...mainData.map(yAccessor)),
    ],
    nice: true,
  });

  const xScale = scalePoint({
    range: [0, xMax],
    domain: xValues,
    padding: 0,
  });

  return (
    <>
      {/* `overflow` is `visible` to make it easier to insert help labels without messing with the layout. */}
      <svg ref={containerRef} width={width} height={height} overflow="visible">
        <Group left={margin.left} top={margin.top}>
          <text
            textAnchor={'middle'}
            dx={xMax / 2}
            className={'f5 space ttc fossheim-purple'}
          >
            {showHelp ? (
              <>
                <tspan className="toogle-gray">{'Sub-Região'}</tspan>
                <tspan>{` ${lineToHighlight.toLowerCase()}`}</tspan>
              </>
            ) : (
              lineToHighlight.toLowerCase()
            )}
          </text>
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke={Theme.axisColor}
            tickStroke={Theme.axisColor}
            tickLabelProps={(value) => {
              return {
                // Default values: https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisBottom.tsx.
                dy: '0.25em',
                fill: Theme.axisColor,
                fontSize: value === maxX ? 11 : 10,
                textAnchor: 'middle',
                className: 'space ' + (value === maxX ? 'b' : 'normal'),
              };
            }}
            tickFormat={(value) =>
              showHelp && value === maxX ? `${value} (top)` : value
            }
          />
          {showYAxis &&
            (mirrorYAxis ? (
              <AxisRight
                left={xMax + 5}
                scale={yScale}
                numTicks={5}
                stroke={Theme.axisColor}
                tickStroke={Theme.axisColor}
                tickLabelProps={() => ({
                  dx: '0.25em',
                  dy: '0.25em',
                  fill: Theme.axisColor,
                  className: 'space',
                  fontSize: 10,
                  textAnchor: 'start',
                })}
                tickFormat={(value, index, ticks) =>
                  showHelp && index === ticks[ticks.length - 1].index
                    ? `${value} (milhões Kg)`
                    : value
                }
              />
            ) : (
              <AxisLeft
                left={-5}
                scale={yScale}
                numTicks={5}
                stroke={Theme.axisColor}
                tickStroke={Theme.axisColor}
                tickLabelProps={() => ({
                  dx: '-0.25em',
                  dy: '0.25em',
                  fill: Theme.axisColor,
                  className: 'space',
                  fontSize: 10,
                  textAnchor: 'end',
                })}
                tickFormat={(value, index, ticks) =>
                  showHelp && index === ticks[ticks.length - 1].index
                    ? `${value} (milhões Kg)`
                    : value
                }
              />
            ))}

          {[...colorValuesBackground].map((color) => {
            const dataToPlot = mainData.filter(
              (d) => colorAccessor(d) === color
            );

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
            data={dataToHighlight}
            curve={curveLinear}
            x={(d) => xScale(xAccessor(d))}
            y={(d) => yScale(yAccessor(d))}
            stroke={Theme.highlightLine}
            strokeWidth={1.5}
          />
          {dataToHighlight.map((point, i) => {
            return (
              <Circle
                key={`point-${colorAccessor(point)}-${i}`}
                cx={xScale(xAccessor(point))}
                cy={yScale(yAccessor(point))}
                className={'pointer'}
                r={10}
                fill={'transparent'}
                onMouseMove={() => {
                  showTooltip({
                    tooltipData: xAccessor(point),
                    tooltipTop: yScale(yAccessor(point)) - singleMargin * 2, // - 50
                    tooltipLeft: xScale(xAccessor(point)) - 10, // + 5
                  });
                }}
                onMouseLeave={hideTooltip}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
          <div className="flex flex-column">
            <span
              className={
                'tc bb b--custom-light-gray space toggle-gray f6 ' +
                (tooltipData === maxX ? 'b' : 'normal')
              }
            >
              {tooltipData}
            </span>
            <PieChart
              data={categoryData.filter(
                (d) =>
                  xAccessor(d) === tooltipData &&
                  colorAccessor(d) === lineToHighlight
              )}
              valueAccessor={yAccessor}
              categoryAccessor={categoryAccessor}
            ></PieChart>
          </div>
        </TooltipInPortal>
      )}
    </>
  );
}
