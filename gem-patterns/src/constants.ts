import { randomPattern } from "./patterns";

export interface Datum {
  pattern: ReturnType<typeof randomPattern>;
  x: string;
  y: number;
}

export const DATA: Datum[] = [
  { pattern: randomPattern(), x: "A", y: 28 },
  { pattern: randomPattern(), x: "B", y: 55 },
  { pattern: randomPattern(), x: "C", y: 43 },
  { pattern: randomPattern(), x: "D", y: 91 },
  { pattern: randomPattern(), x: "E", y: 81 },
  { pattern: randomPattern(), x: "F", y: 53 },
  { pattern: randomPattern(), x: "G", y: 19 },
  { pattern: randomPattern(), x: "H", y: 87 },
  { pattern: randomPattern(), x: "I", y: 52 },
];
