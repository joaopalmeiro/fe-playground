import { sankey, sankeyLinkHorizontal } from "d3-sankey";
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

const linkPath = sankeyLinkHorizontal<NodeDatum, LinkDatum>();

function SankeyChart({ height, width, data }: SankeyChartProps): JSX.Element {
  const { nodes, links } = layout.extent([
    [0, 0],
    [width, height],
  ])(data);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      <g className="stroke-slate-200">
        {links.map((link) => (
          <path d={linkPath(link) ?? ""} key={link.index} strokeWidth={link.width} />
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
