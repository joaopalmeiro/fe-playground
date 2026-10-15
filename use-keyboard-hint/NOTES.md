# Notes

- https://gitlab.com/joaommpalmeiro/template-react-vite
- https://astryx.atmeta.com/components/useKeyboardHint
  - "Shows an ephemeral "← → to navigate" hint anchored to the focused item the first time a roving-tabindex composite (Toolbar, TabList, SegmentedControl, etc.) receives keyboard focus."
- https://base-ui.com/react/components/toolbar
  - "Use inputs sparingly: Left and right arrow keys are used to both move the text insertion cursor in an input, and to navigate among controls in horizontal toolbars. When using an input in a horizontal toolbar, use only one and place it as the last element of the toolbar."
- https://astryx.atmeta.com/storybook/?path=/docs/core-toolbar--docs
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:popover-open
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover
- https://react.dev/reference/react/useRef
  - "Changing a ref does not trigger a re-render. This means refs are perfect for storing information that doesn't affect the visual output of your component. For example, if you need to store an interval ID and retrieve it later, you can put it in a ref."
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-name
- https://github.com/facebook/astryx/blob/v0.7.0/packages/core/src/Layer/useLayer.tsx
- https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget

## Commands

```bash
rm -rf node_modules/ && npm install
```

```bash
npm config ls -l
```

### Clean slate

```bash
rm -rf dist/ node_modules/
```

## Snippets

- https://github.com/facebook/astryx/blob/v0.7.0/packages/core/src/hooks/useKeyboardHint.tsx

````tsx
// Copyright (c) Meta Platforms, Inc. and affiliates.

"use client";

/**
 * @file useKeyboardHint.tsx
 * @input Uses React, StyleX, Kbd, useLayer, i18n (useTranslator)
 * @output Exports useKeyboardHint hook — ephemeral arrow-key navigation hint
 * @position Core hook; shows sighted keyboard users how to navigate composite
 *   widgets that use roving tabindex (single Tab stop, arrows inside)
 *
 * SYNC: When modified, update:
 * - /packages/core/src/hooks/index.ts
 * - /packages/core/src/hooks/useKeyboardHint.doc.mjs
 * - /apps/storybook/stories/useKeyboardHint.stories.tsx
 * - /packages/cli/assets/templates/blocks/components/Hooks/useKeyboardHintHookUsage.tsx
 */

import * as stylex from "@stylexjs/stylex";
import React, { useCallback, useEffect, useRef, type ReactNode } from "react";

import { useTranslator } from "../i18n";
import { Kbd } from "../Kbd";
import { useLayer } from "../Layer/useLayer";
import { colorVars, radiusVars, shadowVars, spacingVars, typeScaleVars } from "../theme/tokens.stylex";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KeyboardHintOrientation = "horizontal" | "vertical" | "both";

export interface UseKeyboardHintOptions {
  /**
   * Orientation of the arrow-key navigation. Controls which arrow icons are
   * shown in the hint badge.
   * - `'horizontal'` → ← →
   * - `'vertical'` → ↑ ↓
   * - `'both'` → ← → ↑ ↓
   * @default 'horizontal'
   */
  orientation?: KeyboardHintOrientation;

  /**
   * Milliseconds before the hint auto-dismisses after appearing.
   * @default 3000
   */
  dismissAfterMs?: number;

  /**
   * Whether the hint is enabled. Set to false to disable for a specific
   * instance (e.g. when the widget is read-only or the user has dismissed
   * globally).
   * @default true
   */
  isEnabled?: boolean;
}

export interface UseKeyboardHintReturn {
  /**
   * The popover hint element to render inside your component tree (portals to
   * top layer via `popover="manual"`). Render unconditionally — it manages its
   * own visibility.
   */
  hintElement: ReactNode;

  /**
   * Attach to the composite container's `onFocus`. Shows the hint on the first
   * keyboard-focus (`:focus-visible`) entry from outside.
   */
  onFocus: (e: React.FocusEvent) => void;

  /**
   * Attach to the composite container's `onBlur`. Hides the hint when focus
   * leaves the composite entirely.
   */
  onBlur: (e: React.FocusEvent) => void;

  /**
   * Attach to the composite container's `onKeyDown`. Dismisses the hint on the
   * first arrow press (the user discovered the interaction).
   */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const ARROW_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

const ARROW_HINT_KEYS: Record<KeyboardHintOrientation, ReadonlyArray<string>> = {
  horizontal: ["left", "right"],
  vertical: ["up", "down"],
  both: ["left", "right", "up", "down"],
};

const styles = stylex.create({
  hint: {
    // Top layer + anchor positioned
    position: "fixed",
    inset: "auto",
    margin: 0,
    borderWidth: 0,
    borderStyle: "none",

    // Surface
    backgroundColor: colorVars["--color-background-popover"],
    borderRadius: radiusVars["--radius-element"],
    boxShadow: shadowVars["--shadow-low"],
    paddingBlockStart: spacingVars["--spacing-1"],
    paddingBlockEnd: spacingVars["--spacing-1"],
    paddingInlineStart: spacingVars["--spacing-2"],
    paddingInlineEnd: spacingVars["--spacing-2"],

    // Typography
    fontSize: typeScaleVars["--text-supporting-size"],
    lineHeight: typeScaleVars["--text-supporting-leading"],
    color: colorVars["--color-text-secondary"],
    whiteSpace: "nowrap",

    // Animation
    opacity: {
      default: 0,
      ":popover-open": 1,
    },
    transitionProperty: "opacity, display, overlay",
    transitionDuration: "150ms",
    transitionBehavior: "allow-discrete",

    // Don't capture pointer events (hint floats above content)
    pointerEvents: "none",
  },
  keys: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacingVars["--spacing-1"],
  },
  label: {
    marginInlineStart: spacingVars["--spacing-1"],
  },
});

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shows an ephemeral visual hint ("← → to navigate") anchored to the focused
 * item when a composite widget first receives keyboard focus. Teaches sighted
 * keyboard users that arrows navigate within the group.
 *
 * The hint renders in the top layer (popover="manual") and is CSS-anchor-
 * positioned to the currently focused element, so it is never clipped by
 * overflow containers. It auto-dismisses on first arrow press, timeout, or
 * blur, and does not re-show for that instance.
 *
 * @example
 * ```
 * const hint = useKeyboardHint({orientation: 'horizontal'});
 * <div role="toolbar" onFocus={hint.onFocus} onBlur={hint.onBlur} onKeyDown={hint.onKeyDown}>
 *   {children}
 *   {hint.hintElement}
 * </div>
 * ```
 */
export function useKeyboardHint(options: UseKeyboardHintOptions = {}): UseKeyboardHintReturn {
  const { orientation = "horizontal", dismissAfterMs = 3000, isEnabled = true } = options;

  const t = useTranslator();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const layerAnchorRef = useRef<(el: HTMLElement | null) => void>(() => {});

  const clearDismissTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleLayerShow = useCallback(() => {
    isVisibleRef.current = true;
  }, []);

  const handleLayerHide = useCallback(() => {
    isVisibleRef.current = false;
    clearDismissTimeout();
    layerAnchorRef.current(null);
  }, [clearDismissTimeout]);

  const layer = useLayer({
    mode: "context",
    onShow: handleLayerShow,
    onHide: handleLayerHide,
  });
  layerAnchorRef.current = layer.ref;

  // Hide + mark dismissed (won't re-show for this instance)
  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    clearDismissTimeout();
    layer.hide();
    isVisibleRef.current = false;
    layerAnchorRef.current(null);
  }, [clearDismissTimeout, layer]);

  // Show the layer anchored to the focused element
  const show = useCallback(
    (anchor: HTMLElement) => {
      if (dismissedRef.current || !isEnabled) {
        return;
      }

      layerAnchorRef.current(anchor);
      layer.show();

      clearDismissTimeout();
      timeoutRef.current = setTimeout(() => {
        dismiss();
      }, dismissAfterMs);
    },
    [clearDismissTimeout, dismiss, dismissAfterMs, isEnabled, layer],
  );

  // Cleanup on unmount
  useEffect(
    () => () => {
      clearDismissTimeout();
      layerAnchorRef.current(null);
    },
    [clearDismissTimeout],
  );

  // --- Handlers ---

  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (dismissedRef.current || !isEnabled) {
        return;
      }
      // Only show on keyboard focus (focus-visible)
      const target = e.target as HTMLElement;
      if (!target.matches(":focus-visible")) {
        return;
      }
      // Only show when focus enters from outside the container
      const container = e.currentTarget as HTMLElement;
      if (e.relatedTarget instanceof Node && container.contains(e.relatedTarget)) {
        return;
      }
      show(target);
    },
    [show, isEnabled],
  );

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!isVisibleRef.current) {
        return;
      }
      const container = e.currentTarget as HTMLElement;
      // Only dismiss when focus leaves the container entirely
      if (e.relatedTarget instanceof Node && container.contains(e.relatedTarget)) {
        // Focus moved within — re-anchor to the new target
        if (!dismissedRef.current && e.relatedTarget instanceof HTMLElement) {
          layerAnchorRef.current(e.relatedTarget);
        }
        return;
      }
      dismiss();
    },
    [dismiss],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isVisibleRef.current) {
        return;
      }
      if (ARROW_KEYS.has(e.key)) {
        dismiss();
      }
    },
    [dismiss],
  );

  // --- Render the hint element ---

  const arrowContent = (
    <span {...stylex.props(styles.keys)}>
      {ARROW_HINT_KEYS[orientation].map((key) => (
        <Kbd key={key} keys={key} />
      ))}
    </span>
  );

  const hintElement = layer.render(
    <span aria-hidden="true">
      {arrowContent}
      <span {...stylex.props(styles.label)}>{t("@astryx.keyboardHint.toNavigate")}</span>
    </span>,
    {
      placement: "below",
      alignment: "start",
      xstyle: styles.hint,
      style: {
        marginBlockStart: spacingVars["--spacing-2"],
      },
    },
  );

  return { hintElement, onFocus, onBlur, onKeyDown };
}
````

- https://github.com/facebook/astryx/blob/v0.7.0/packages/core/src/Toolbar/Toolbar.tsx

````tsx
// Copyright (c) Meta Platforms, Inc. and affiliates.

"use client";

/**
 * @file Toolbar.tsx
 * @input Uses Section, SizeContext, useListFocus, useKeyboardHint, StyleX, spacingVars, sizeVars
 * @output Exports Toolbar component and ToolbarProps
 * @position Core implementation; consumed by index.ts
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Toolbar/Toolbar.doc.mjs
 * - /packages/core/src/Toolbar/Toolbar.test.tsx
 * - /packages/core/src/Toolbar/index.ts
 * - /apps/storybook/stories/Toolbar.stories.tsx
 * - /packages/cli/assets/templates/blocks/components/Toolbar/ (showcase blocks)
 */

import * as stylex from "@stylexjs/stylex";
import { useCallback, type ReactNode } from "react";

import type { BaseProps } from "../BaseProps";
import { useKeyboardHint } from "../hooks/useKeyboardHint";
import { useListFocus } from "../hooks/useListFocus";
import { edgeCompSlot } from "../Layout/edgeCompensation.stylex";
import type { SectionVariant } from "../Section/Section";
import { Section } from "../Section/Section";
import type { ElementSize } from "../SizeContext/SizeContext";
import { SizeProvider } from "../SizeContext/SizeContext";
import { spacingVars, sizeVars } from "../theme/tokens.stylex";
import { mergeProps } from "../utils";
import { themeProps } from "../utils/themeProps";
import type { SpacingStep } from "../utils/types";

/**
 * Map SpacingStep values to spacingVars keys.
 */
const spacingStepToVar: Record<SpacingStep, keyof typeof spacingVars> = {
  0: "--spacing-0",
  0.5: "--spacing-0-5",
  1: "--spacing-1",
  1.5: "--spacing-1-5",
  2: "--spacing-2",
  3: "--spacing-3",
  4: "--spacing-4",
  5: "--spacing-5",
  6: "--spacing-6",
  8: "--spacing-8",
  10: "--spacing-10",
};

const styles = stylex.create({
  // Two-slot layout (no centerContent): flex row, space-between
  baseFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Three-slot layout (with centerContent): CSS grid 1fr auto 1fr
  baseGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
  },
  // Vertical orientation
  vertical: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  // Slot containers
  startSlot: {
    display: "flex",
    alignItems: "center",
  },
  // `minWidth: 0` lets the `auto` track shrink below the content's width, so a
  // wide center never widens the toolbar. The slot deliberately does not clip
  // (`overflow`): clipping would cut off the box-shadow and focus ring of its
  // outermost children, which paint outside their own box.
  centerSlot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },
  endSlot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  // When only startContent is present, let it fill
  startOnly: {
    flex: "1 1 0%",
  },
  // When only endContent, push to end
  endOnly: {
    marginInlineStart: "auto",
  },
});

const sizeStyles = stylex.create({
  base: {
    minHeight: sizeVars["--size-element-sm"],
  },
});

// Dynamic styles for configurable gap and tab indicator offset
const dynamicStyles = stylex.create({
  gap: (gapValue: string) => ({
    gap: gapValue,
  }),
  tabIndicatorBottom: (offset: string) => ({
    "--_tab-indicator-bottom": offset,
  }),
});

/**
 * Default block padding per toolbar size. Inline padding comes from the
 * parent container (Card, Section, LayoutHeader) via the Section's
 * theme default — the toolbar only controls its vertical tightness.
 */
const defaultBlockPaddingForSize: Record<ElementSize, SpacingStep> = {
  sm: 2,
  md: 2,
  lg: 2,
};

const blockPaddingVarForSize: Record<ElementSize, string> = {
  sm: spacingVars["--spacing-2"],
  md: spacingVars["--spacing-2"],
  lg: spacingVars["--spacing-2"],
};

/**
 * Edge compensation inset amount per toolbar size.
 * Equals container-inline-padding minus the toolbar's block padding,
 * creating even spacing around edge-compensated items (ghost buttons, tabs).
 */
const edgeCompInsetForSize: Record<ElementSize, string> = {
  sm: `calc(var(--container-padding-inline-start, ${spacingVars["--spacing-4"]}) - ${spacingVars["--spacing-2"]})`,
  md: `calc(var(--container-padding-inline-start, ${spacingVars["--spacing-4"]}) - ${spacingVars["--spacing-2"]})`,
  lg: `calc(var(--container-padding-inline-start, ${spacingVars["--spacing-4"]}) - ${spacingVars["--spacing-2"]})`,
};

export type ToolbarSize = ElementSize;

export interface ToolbarProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root Section element */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Content aligned to the start (left in LTR).
   */
  startContent?: ReactNode;
  /**
   * Content centered between start and end.
   * When provided, switches layout to CSS grid (1fr auto 1fr).
   */
  centerContent?: ReactNode;
  /**
   * Content aligned to the end (right in LTR).
   */
  endContent?: ReactNode;
  /**
   * Accessible label for the toolbar.
   * Applied as aria-label on the inner toolbar element.
   */
  label: string;
  /**
   * Size of the toolbar. Coordinates with Button, TextInput, TabList, and Selector —
   * children inherit this size as their default via SizeContext.
   *
   * - `'sm'`: Compact — fits sm buttons/inputs (28px elements)
   * - `'md'`: Standard — fits md buttons/inputs (32px elements)
   * - `'lg'`: Spacious — fits lg buttons/inputs (36px elements)
   * @default 'md'
   */
  size?: ToolbarSize;
  /**
   * Gap between items within each slot, using the spacing scale.
   * @default 1
   */
  gap?: SpacingStep;
  /**
   * Orientation of the toolbar for keyboard navigation.
   * Controls which arrow keys navigate between items.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Visual variant passed through to Section.
   * @default 'transparent'
   */
  variant?: SectionVariant;

  /**
   * Which sides should have divider borders.
   * Passed through to Section.
   * @example
   * ```
   * dividers={['bottom']}
   * ```
   */
  dividers?: ("top" | "bottom" | "start" | "end")[];
}

/**
 * General-purpose toolbar with start, center, and end content slots.
 *
 * Built on Section, provides flex/grid layout with roving tabindex
 * keyboard navigation via useListFocus. Cascades `size` to child components
 * (Button, TextInput, TabList, Selector) via SizeContext, and applies
 * edge compensation so ghost buttons align flush at container edges.
 *
 * @example
 * ```
 * <Toolbar label="Actions" size="sm"
 *   startContent={<Button label="Cut" variant="ghost" />}
 *   endContent={<Button label="Settings" variant="ghost" />}
 * />
 * ```
 */
export function Toolbar({
  startContent,
  centerContent,
  endContent,
  label,
  size = "md",
  gap = 1,
  orientation = "horizontal",
  variant = "transparent",
  dividers,
  xstyle,
  className,
  style,
  ref,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  role: _role,
  "aria-label": _ariaLabel,
  "aria-orientation": _ariaOrientation,
  ...props
}: ToolbarProps) {
  const hasCenterContent = centerContent != null;
  const hasStartContent = startContent != null;
  const hasEndContent = endContent != null;
  const hasBottomDivider = dividers?.includes("bottom") ?? false;

  const gapVar = spacingVars[spacingStepToVar[gap]] as string;

  const { listRef, handleKeyDown, handleFocus } = useListFocus<HTMLDivElement>({
    itemSelector: "button, input, [tabindex]",
    orientation,
    hasRovingTabIndex: true,
    hasCaretGuard: true,
  });

  const {
    hintElement,
    onKeyDown: onHintKeyDown,
    onFocus: onHintFocus,
    onBlur: onHintBlur,
  } = useKeyboardHint({ orientation });

  const handleToolbarKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintKeyDown(e);
      handleKeyDown(e);
    },
    [onKeyDownProp, onHintKeyDown, handleKeyDown],
  );

  const handleToolbarFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onFocusProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintFocus(e);
      handleFocus(e);
    },
    [onFocusProp, onHintFocus, handleFocus],
  );

  const handleToolbarBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onBlurProp?.(e);
      if (e.defaultPrevented) {
        return;
      }
      onHintBlur(e);
    },
    [onBlurProp, onHintBlur],
  );

  return (
    <SizeProvider value={size}>
      <Section
        ref={ref}
        variant={variant}
        paddingBlock={defaultBlockPaddingForSize[size]}
        dividers={dividers}
        xstyle={xstyle}
        className={className}
        style={style}
      >
        <div
          ref={listRef}
          role="toolbar"
          aria-label={label}
          aria-orientation={orientation}
          onKeyDown={handleToolbarKeyDown}
          onFocus={handleToolbarFocus}
          onBlur={handleToolbarBlur}
          {...mergeProps(
            themeProps("toolbar", { size }),
            stylex.props(
              hasCenterContent ? styles.baseGrid : styles.baseFlex,
              orientation === "vertical" && styles.vertical,
              sizeStyles.base,
              dynamicStyles.gap(gapVar),
              // Only drop the tab indicator through the toolbar's block padding
              // onto the rail when a bottom divider is actually present.
              // Without a divider, leave `--_tab-indicator-bottom` unset so a
              // nested TabList's indicator keeps its own default (hugging the
              // tab) instead of floating down into the toolbar's padding.
              hasBottomDivider &&
                dynamicStyles.tabIndicatorBottom(`calc(-1 * (${blockPaddingVarForSize[size]} + 1px))`),
            ),
          )}
          {...props}
        >
          {hasCenterContent ? (
            // Three-slot grid layout
            <>
              <div
                {...stylex.props(
                  styles.startSlot,
                  edgeCompSlot.inset(edgeCompInsetForSize[size]),
                  dynamicStyles.gap(gapVar),
                )}
              >
                {startContent}
              </div>
              <div {...stylex.props(styles.centerSlot, dynamicStyles.gap(gapVar))}>{centerContent}</div>
              <div
                {...stylex.props(
                  styles.endSlot,
                  edgeCompSlot.inset(edgeCompInsetForSize[size]),
                  dynamicStyles.gap(gapVar),
                )}
              >
                {endContent}
              </div>
            </>
          ) : (
            // Two-slot flex layout
            <>
              {hasStartContent && (
                <div
                  {...stylex.props(
                    styles.startSlot,
                    !hasEndContent && styles.startOnly,
                    edgeCompSlot.inset(edgeCompInsetForSize[size]),
                    dynamicStyles.gap(gapVar),
                  )}
                >
                  {startContent}
                </div>
              )}
              {hasEndContent && (
                <div
                  {...stylex.props(
                    styles.endSlot,
                    !hasStartContent && styles.endOnly,
                    edgeCompSlot.inset(edgeCompInsetForSize[size]),
                    dynamicStyles.gap(gapVar),
                  )}
                >
                  {endContent}
                </div>
              )}
            </>
          )}
          {hintElement}
        </div>
      </Section>
    </SizeProvider>
  );
}

Toolbar.displayName = "Toolbar";
````
