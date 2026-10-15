import { useEffect, useId, useRef } from "react";
import type { FocusEvent, JSX, KeyboardEvent } from "react";

type Orientation = "horizontal" | "vertical";

interface UseKeyboardHintOptions {
  /** Which arrows to show in the hint. */
  orientation?: Orientation;
  /** Auto-dismiss delay in milliseconds. */
  dismissAfterMs?: number;
}

interface UseKeyboardHintReturn {
  /** Render inside the composite. It manages its own visibility (top layer via `popover="manual"`). */
  hintElement: JSX.Element;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const ARROWS: Record<Orientation, string[]> = {
    horizontal: ["←", "→"],
    vertical: ["↑", "↓"],
  },
  ARROW_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

/**
 * Shows an ephemeral "← → to navigate" hint below the focused item the first time
 * a roving-tabindex composite (e.g. a toolbar) receives keyboard focus from outside.
 * Dismissed on the first arrow press, on timeout, or when focus leaves the composite,
 * and never shown again for this instance.
 */
export function useKeyboardHint({
  orientation = "horizontal",
  dismissAfterMs = 3000,
}: UseKeyboardHintOptions = {}): UseKeyboardHintReturn {
  // React 19.2 ids (e.g. `_r_0_`) are valid CSS idents, so they work as anchor names.
  const anchorName = `--keyboard-hint${useId()}`,
    hintRef = useRef<HTMLSpanElement>(null),
    anchorRef = useRef<HTMLElement | null>(null),
    timeoutRef = useRef<number | undefined>(),
    isDismissedRef = useRef(false);

  // The hint is CSS-anchor-positioned to whichever element carries the anchor name.
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
      // Visual-only aid: the toolbar role already conveys arrow-key navigation to screen readers.
      aria-hidden="true"
      style={{ positionAnchor: anchorName }}
      className="pointer-events-none inset-auto [top:anchor(bottom)] [left:anchor(left)] m-0 mt-2 items-center gap-1 border border-neutral-950 bg-white px-2 py-1 text-xs whitespace-nowrap text-neutral-700 shadow-[0.25rem_0.25rem_0] shadow-black/12 open:flex"
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
