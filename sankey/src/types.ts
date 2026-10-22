export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  links: SankeyLink[];
}

export interface SankeyChartProps {
  height: number;
  width: number;
  data: SankeyData;
}

export interface NodeDatum {
  id: string;
}

export interface LinkDatum {
  value: number;
}
