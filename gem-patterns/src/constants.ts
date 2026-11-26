import type { PatternId } from "./patterns";

export interface Datum {
  pattern: PatternId;
  x: string;
  y: number;
}

export const DATA: Datum[] = [
  { pattern: 9, x: "A", y: 28 },
  { pattern: 11, x: "B", y: 55 },
  { pattern: 12, x: "C", y: 43 },
  { pattern: 14, x: "D", y: 91 },
  { pattern: 16, x: "E", y: 81 },
  { pattern: 17, x: "F", y: 53 },
  { pattern: 19, x: "G", y: 19 },
  { pattern: 20, x: "H", y: 87 },
  { pattern: 24, x: "I", y: 52 },
];
