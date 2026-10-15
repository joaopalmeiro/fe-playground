import { useRef } from "react";
import type { FocusEvent, JSX, KeyboardEvent } from "react";

type Orientation = "horizontal" | "vertical";

interface UseKeyboardHintOptions {
  orientation?: Orientation;
  dismissAfterMs?: number;
}

interface UseKeyboardHintReturn {
  hintElement: JSX.Element;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const NAVIGATION_KEYS: Record<Orientation, readonly string[]> = {
  horizontal: ["ArrowLeft", "ArrowRight"],
  vertical: ["ArrowUp", "ArrowDown"],
};

const ARROWS: Record<Orientation, readonly string[]> = {
  horizontal: ["←", "→"],
  vertical: ["↑", "↓"],
};

const ANCHOR_NAME = "--keyboard-hint";

// Based on: https://github.com/facebook/astryx/blob/v0.7.0/packages/core/src/hooks/useKeyboardHint.tsx
export function useKeyboardHint({
  orientation = "horizontal",
  dismissAfterMs = 3000,
}: UseKeyboardHintOptions = {}): UseKeyboardHintReturn {
  const hintRef = useRef<HTMLSpanElement>(null);
  const isDismissedRef = useRef(false);

  function isOpen(): boolean {
    return hintRef.current?.matches(":popover-open") ?? false;
  }

  function dismiss(): void {
    isDismissedRef.current = true;

    if (isOpen()) {
      hintRef.current?.hidePopover();
    }
  }

  function onFocus(event: FocusEvent<HTMLElement>): void {
    if (isDismissedRef.current) {
      return;
    }

    event.target.style.setProperty("anchor-name", ANCHOR_NAME);

    const isKeyboardFocus = event.target.matches(":focus-visible");
    const isEnteringFromOutside = !event.currentTarget.contains(event.relatedTarget);

    if (isKeyboardFocus && isEnteringFromOutside) {
      hintRef.current?.showPopover();
      setTimeout(dismiss, dismissAfterMs);
    }
  }

  function onBlur(event: FocusEvent<HTMLElement>): void {
    event.target.style.removeProperty("anchor-name");

    const isLeaving = !event.currentTarget.contains(event.relatedTarget);

    if (isOpen() && isLeaving) {
      dismiss();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (isOpen() && NAVIGATION_KEYS[orientation].includes(event.key)) {
      dismiss();
    }
  }

  const hintElement = (
    <span
      ref={hintRef}
      popover="manual"
      aria-hidden="true"
      className="pointer-events-none inset-auto top-[anchor(bottom)] left-[anchor(left)] m-0 mt-2 items-center gap-1 border border-neutral-950 bg-white px-2 py-1 text-xs whitespace-nowrap text-neutral-700 [position-anchor:--keyboard-hint] open:flex"
    >
      {ARROWS[orientation].map((arrow) => (
        <kbd key={arrow} className="border border-neutral-300 px-1 font-sans text-neutral-950">
          {arrow}
        </kbd>
      ))}
      <span className="ml-1">to navigate</span>
    </span>
  );

  return { hintElement, onBlur, onFocus, onKeyDown };
}
