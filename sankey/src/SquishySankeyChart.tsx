import { sankey } from "d3-sankey";
import type { SankeyLink as D3SankeyLink, SankeyNode } from "d3-sankey";
import type { JSX } from "react";

import type { LinkDatum, NodeDatum, SankeyChartProps, SankeyData } from "./types.ts";

const NODE_WIDTH = 12;
const NODE_PADDING = 16;
const LABEL_OFFSET = 6;

const layout = sankey<SankeyData, NodeDatum, LinkDatum>()
  .nodeId((node) => node.id)
  .nodeWidth(NODE_WIDTH)
  .nodePadding(NODE_PADDING)
  .nodes(({ links }) => Array.from(new Set(links.flatMap((link) => [link.source, link.target])), (id) => ({ id })))
  .links(({ links }) => structuredClone(links));

const LINK_NECK = 0.15;

function linkPath(link: D3SankeyLink<NodeDatum, LinkDatum>): string {
  const source = link.source as SankeyNode<NodeDatum, LinkDatum>;
  const target = link.target as SankeyNode<NodeDatum, LinkDatum>;
  const x0 = source.x1 ?? 0;
  const x1 = target.x0 ?? 0;
  const y0 = link.y0 ?? 0;
  const y1 = link.y1 ?? 0;
  const xm = (x0 + x1) / 2;
  const half = (link.width ?? 0) / 2;

  const pinch = (half * (1 - LINK_NECK)) / 0.75;

  return (
    `M${x0},${y0 - half}C${xm},${y0 - half + pinch} ${xm},${y1 - half + pinch} ${x1},${y1 - half}` +
    `L${x1},${y1 + half}C${xm},${y1 + half - pinch} ${xm},${y0 + half - pinch} ${x0},${y0 + half}Z`
  );
}

function SankeyChart({ height, width, data }: SankeyChartProps): JSX.Element {
  const { nodes, links } = layout.extent([
    [0, 0],
    [width, height],
  ])(data);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      <g>
        {links.map((link) => (
          <path className="fill-slate-200" d={linkPath(link)} key={link.index} />
        ))}
      </g>

      {nodes.map((node) => {
        const x0 = node.x0 ?? 0;
        const x1 = node.x1 ?? 0;
        const y0 = node.y0 ?? 0;
        const y1 = node.y1 ?? 0;
        const isRightHalf = x0 > width / 2;

        return (
          <g key={node.id}>
            <rect className="fill-slate-700" height={y1 - y0} width={x1 - x0} x={x0} y={y0} />
            <text
              className="fill-slate-900 text-xs"
              dominantBaseline="middle"
              textAnchor={isRightHalf ? "end" : "start"}
              x={isRightHalf ? x0 - LABEL_OFFSET : x1 + LABEL_OFFSET}
              y={(y0 + y1) / 2}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default SankeyChart;
