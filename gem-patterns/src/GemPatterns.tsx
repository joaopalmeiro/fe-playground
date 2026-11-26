import type { JSX } from "react";

import { GEM_PATTERNS, PATTERN_ELEMENT_ID_PREFIX, PATTERN_HEIGHT, PATTERN_WIDTH, patternToPath } from "./patterns";

const PIXEL_SIZE = 2;

function GemPatterns(): JSX.Element {
  return (
    <defs>
      {Object.entries(GEM_PATTERNS).map(([patternId, rows]) => (
        <pattern
          key={patternId}
          id={`${PATTERN_ELEMENT_ID_PREFIX}${patternId}`}
          patternUnits="userSpaceOnUse"
          width={PATTERN_WIDTH * PIXEL_SIZE}
          height={PATTERN_HEIGHT * PIXEL_SIZE}
        >
          <path d={patternToPath(rows)} className="fill-slate-700" transform={`scale(${PIXEL_SIZE})`} />
        </pattern>
      ))}
    </defs>
  );
}

export default GemPatterns;
