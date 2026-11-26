import { scaleBand, scaleLinear } from "d3-scale";
import type { JSX } from "react";

import type { Datum } from "./constants";
import GemPatterns from "./GemPatterns";
import { PATTERN_ELEMENT_ID_PREFIX } from "./patterns";

const BAND_PADDING = 0.1;
const WIDTH = 300;
const HEIGHT = 200;
const ORIGIN = 0;

interface BarChartProps {
  data: Datum[];
}

function BarChart({ data }: BarChartProps): JSX.Element {
  const xScale = scaleBand()
    .domain(data.map((datum) => datum.x))
    .range([ORIGIN, WIDTH])
    .padding(BAND_PADDING)
    .round(true);

  const yScale = scaleLinear()
    .domain([ORIGIN, Math.max(...data.map((datum) => datum.y))])
    .range([HEIGHT, ORIGIN]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <GemPatterns />
      {data.map((datum) => (
        <rect
          key={datum.x}
          x={xScale(datum.x)}
          y={yScale(datum.y)}
          width={xScale.bandwidth()}
          height={HEIGHT - yScale(datum.y)}
          fill={`url(#${PATTERN_ELEMENT_ID_PREFIX}${datum.pattern})`}
          className="stroke-slate-700"
        />
      ))}
    </svg>
  );
}

export default BarChart;
