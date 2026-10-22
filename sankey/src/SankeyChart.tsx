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

interface LayoutNode {
  id: string;
  depth: number;
  value: number;
  x: number;
  y: number;
  height: number;
}

interface LayoutLink {
  link: SankeyLink;
  source: LayoutNode;
  target: LayoutNode;
  width: number;
  y0: number;
  y1: number;
}

const NODE_WIDTH = 12;
const NODE_PADDING = 16;
const LABEL_OFFSET = 6;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function computeLayout(
  links: SankeyLink[],
  width: number,
  height: number,
): { nodes: LayoutNode[]; links: LayoutLink[] } {
  const ids = [...new Set(links.flatMap((link) => [link.source, link.target]))];

  // 1. Depth (column) of each node: longest path from a source node.
  // Relaxing every link once per node is enough for an acyclic graph.
  const depths = new Map(ids.map((id) => [id, 0]));
  for (let pass = 0; pass < ids.length; pass += 1) {
    for (const link of links) {
      const next = (depths.get(link.source) ?? 0) + 1;
      if (next > (depths.get(link.target) ?? 0)) {
        depths.set(link.target, next);
      }
    }
  }
  const maxDepth = Math.max(...depths.values());

  // 2. Value of each node: the larger of its total inflow and outflow.
  const nodes: LayoutNode[] = ids.map((id) => ({
    depth: depths.get(id) ?? 0,
    height: 0,
    id,
    value: Math.max(
      sum(links.filter((link) => link.target === id).map((link) => link.value)),
      sum(links.filter((link) => link.source === id).map((link) => link.value)),
    ),
    x: 0,
    y: 0,
  }));

  // 3. Group nodes into columns and pick one value-to-pixel scale that fits the fullest column.
  const columns = Array.from({ length: maxDepth + 1 }, (_, depth) => nodes.filter((node) => node.depth === depth));
  const scale = Math.min(
    ...columns.map((column) => (height - (column.length - 1) * NODE_PADDING) / sum(column.map((node) => node.value))),
  );

  // 4. Position nodes: columns spread horizontally, nodes stacked vertically.
  for (const column of columns) {
    let y = 0;
    for (const node of column) {
      node.x = maxDepth === 0 ? 0 : (node.depth * (width - NODE_WIDTH)) / maxDepth;
      node.y = y;
      node.height = node.value * scale;
      y += node.height + NODE_PADDING;
    }
  }

  // 5. Stack link bands inside their source and target nodes, in input order.
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const sourceOffsets = new Map(nodes.map((node) => [node.id, node.y]));
  const targetOffsets = new Map(nodes.map((node) => [node.id, node.y]));

  const layoutLinks = links.map((link): LayoutLink => {
    const bandWidth = link.value * scale;
    const sourceOffset = sourceOffsets.get(link.source) ?? 0;
    const targetOffset = targetOffsets.get(link.target) ?? 0;
    sourceOffsets.set(link.source, sourceOffset + bandWidth);
    targetOffsets.set(link.target, targetOffset + bandWidth);

    return {
      link,
      source: nodeById.get(link.source) as LayoutNode,
      target: nodeById.get(link.target) as LayoutNode,
      width: bandWidth,
      y0: sourceOffset + bandWidth / 2,
      y1: targetOffset + bandWidth / 2,
    };
  });

  return { links: layoutLinks, nodes };
}

// Horizontal cubic Bézier from the right edge of the source to the left edge of the target.
function linkPath({ source, target, y0, y1 }: LayoutLink): string {
  const x0 = source.x + NODE_WIDTH;
  const x1 = target.x;
  const xm = (x0 + x1) / 2;
  return `M${x0},${y0}C${xm},${y0} ${xm},${y1} ${x1},${y1}`;
}

function SankeyChart({ height, width, series }: SankeyChartProps): JSX.Element {
  const layout = computeLayout(series.data.links, width, height);
  const maxDepth = Math.max(...layout.nodes.map((node) => node.depth));

  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      <g className="stroke-slate-200">
        {layout.links.map((layoutLink) => (
          <path
            d={linkPath(layoutLink)}
            key={`${layoutLink.source.id}-${layoutLink.target.id}`}
            strokeWidth={Math.max(1, layoutLink.width)}
          />
        ))}
      </g>

      {layout.nodes.map((node) => {
        const isLast = node.depth === maxDepth && maxDepth > 0;
        return (
          <g key={node.id}>
            <rect className="fill-slate-700" height={node.height} width={NODE_WIDTH} x={node.x} y={node.y} />
            <text
              className="fill-slate-900 text-xs"
              dominantBaseline="middle"
              textAnchor={isLast ? "end" : "start"}
              x={isLast ? node.x - LABEL_OFFSET : node.x + NODE_WIDTH + LABEL_OFFSET}
              y={node.y + node.height / 2}
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
