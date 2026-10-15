import { useEffect, useId, useRef } from "react";
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

const ARROW_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

const ARROWS: Record<Orientation, ReadonlyArray<string>> = {
  horizontal: ["←", "→"],
  vertical: ["↑", "↓"],
};

// Based on: https://github.com/facebook/astryx/blob/v0.7.0/packages/core/src/hooks/useKeyboardHint.tsx
export function useKeyboardHint({
  orientation = "horizontal",
  dismissAfterMs = 3000,
}: UseKeyboardHintOptions = {}): UseKeyboardHintReturn {
  const anchorName = `--keyboard-hint${useId()}`;

  const hintRef = useRef<HTMLSpanElement>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDismissedRef = useRef(false);

  function setAnchor(element: HTMLElement | null): void {
    anchorRef.current?.style.removeProperty("anchor-name");
    element?.style.setProperty("anchor-name", anchorName);
    anchorRef.current = element;
  }

  function isOpen(): boolean {
    return hintRef.current?.matches(":popover-open") ?? false;
  }

  function dismiss(): void {
    isDismissedRef.current = true;
    window.clearTimeout(timeoutRef.current);
    if (isOpen()) {
      hintRef.current?.hidePopover();
    }
    setAnchor(null);
  }

  // Cleanup on unmount:
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function onFocus(event: FocusEvent<HTMLElement>): void {
    if (isDismissedRef.current) {
      return;
    }

    // Focus moved within the composite while the hint is showing: follow it.
    if (isOpen()) {
      setAnchor(event.target);
      return;
    }

    const isKeyboardFocus = event.target.matches(":focus-visible"),
      isEnteringFromOutside = !event.currentTarget.contains(event.relatedTarget);
    if (!isKeyboardFocus || !isEnteringFromOutside) {
      return;
    }

    setAnchor(event.target);
    hintRef.current?.showPopover();
    timeoutRef.current = window.setTimeout(dismiss, dismissAfterMs);
  }

  function onBlur(event: FocusEvent<HTMLElement>): void {
    const isLeaving = !event.currentTarget.contains(event.relatedTarget);
    if (isOpen() && isLeaving) {
      dismiss();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>): void {
    if (isOpen() && ARROW_KEYS.has(event.key)) {
      dismiss();
    }
  }

  const hintElement = (
    <span
      ref={hintRef}
      popover="manual"
      aria-hidden="true"
      style={{ positionAnchor: anchorName }}
      className="pointer-events-none inset-auto top-[anchor(bottom)] left-[anchor(left)] m-0 mt-2 items-center gap-1 border border-neutral-950 bg-white px-2 py-1 text-xs whitespace-nowrap text-neutral-700 open:flex"
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
