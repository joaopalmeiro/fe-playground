import type { JSX } from "react";

import { GEM_PATTERNS, PATTERN_HEIGHT, PATTERN_IDS, PATTERN_WIDTH, patternElementId, patternToPath } from "./patterns";

const PATTERN_COLOR = "steelblue";
const PIXEL_SIZE = 2;

function GemPatterns(): JSX.Element {
  return (
    <defs>
      {PATTERN_IDS.map((patternId) => (
        <pattern
          key={patternId}
          id={patternElementId(patternId)}
          patternUnits="userSpaceOnUse"
          width={PATTERN_WIDTH * PIXEL_SIZE}
          height={PATTERN_HEIGHT * PIXEL_SIZE}
        >
          <path
            d={patternToPath(GEM_PATTERNS[patternId])}
            fill={PATTERN_COLOR}
            transform={`scale(${PIXEL_SIZE})`}
          />
        </pattern>
      ))}
    </defs>
  );
}

export default GemPatterns;
