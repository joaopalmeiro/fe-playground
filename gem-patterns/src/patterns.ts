// Source: https://github.com/emutos/emutos/blob/d54e1d724bc79697c27753131709cf2015079f33/vdi/vdi_fill.c#L56
export const GEM_PATTERNS = {
  // Trees
  12: [0x02_02, 0x02_02, 0xAAAA, 0x50_50, 0x20_20, 0x20_20, 0xAAAA, 0x05_05],
  // Balls
  19: [0x77_77, 0x98_98, 0xf8_f8, 0xF8F8, 0x77_77, 0x89_89, 0x8F8F, 0x8F8F],
} as const satisfies Record<number, readonly number[]>;

export const PATTERN_WIDTH = 16;
export const PATTERN_HEIGHT = 8;

export type PatternId = keyof typeof GEM_PATTERNS;

export const PATTERN_IDS = Object.keys(GEM_PATTERNS).map(Number) as PatternId[];

export function randomPattern(): PatternId {
  return PATTERN_IDS[Math.floor(Math.random() * PATTERN_IDS.length)];
}

export function patternElementId(patternId: PatternId): string {
  return `gem-pattern-${String(patternId)}`;
}

export function patternToPath(rows: readonly number[]): string {
  return rows
    .flatMap((row, rowIndex) =>
      Array.from(
        row.toString(2).padStart(PATTERN_WIDTH, "0").matchAll(/1/gu),
        (match) => `M${match.index} ${rowIndex}h1v1h-1z`,
      ),
    )
    .join("");
}
