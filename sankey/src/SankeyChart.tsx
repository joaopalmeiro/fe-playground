import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { JSX } from "react";

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyChartProps {
  height: number;
  width: number;
  series: {
    data: {
      links: SankeyLink[];
    };
  };
}

interface NodeDatum {
  id: string;
}

interface LinkDatum {
  value: number;
}

const NODE_WIDTH = 12;
const NODE_PADDING = 16;
const LABEL_OFFSET = 6;

const layout = sankey<NodeDatum, LinkDatum>()
  .nodeId((node) => node.id)
  .nodeWidth(NODE_WIDTH)
  .nodePadding(NODE_PADDING);

const linkPath = sankeyLinkHorizontal<NodeDatum, LinkDatum>();

function SankeyChart({ height, width, series }: SankeyChartProps): JSX.Element {
  const ids = [...new Set(series.data.links.flatMap((link) => [link.source, link.target]))];

  // D3-sankey mutates its input (e.g. replaces link.source ids with node objects), so pass copies.
  const { nodes, links } = layout.extent([
    [0, 0],
    [width, height],
  ])({
    links: series.data.links.map(({ source, target, value }) => ({ source, target, value })),
    nodes: ids.map((id) => ({ id })),
  });

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
