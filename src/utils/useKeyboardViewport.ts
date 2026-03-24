import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type KeyboardPlatform = "iOS" | "Android" | "Other";

export interface KeyboardViewportMetrics {
  platform: KeyboardPlatform;
  innerHeight: number;
  visualViewportHeight: number | null;
  visualViewportOffsetTop: number | null;
  keyboardHeight: number;
  keyboardOpen: boolean;
  supportsVisualViewport: boolean;
  lastEvent: string;
}

export interface UseKeyboardViewportOptions {
  keyboardOpenThreshold?: number;
  maxLift?: number;
  baseContentPadding?: number;
  iosFocusDelay?: number;
  defaultFocusDelay?: number;
  blurDelay?: number;
  restoreScrollOnIOSBlur?: boolean;
  scrollOnFocus?: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
  onFocusSettled?: () => void;
}

export interface UseKeyboardViewportResult<T extends HTMLElement> {
  inputRef: React.RefObject<T | null>;
  metrics: KeyboardViewportMetrics;
  focusCount: number;
  blurCount: number;
  footerLift: number;
  contentPaddingBottom: number;
  handleFocus: () => void;
  handleBlur: () => void;
  remeasure: (eventName?: string) => void;
  bindInput: {
    ref: React.RefObject<T | null>;
    onFocus: () => void;
    onBlur: () => void;
  };
}

function detectPlatform(): KeyboardPlatform {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  return "Other";
}

function roundValue(value: number | null): number | null {
  return value === null ? null : Math.round(value);
}

function createInitialMetrics(platform: KeyboardPlatform): KeyboardViewportMetrics {
  return {
    platform,
    innerHeight: 0,
    visualViewportHeight: null,
    visualViewportOffsetTop: null,
    keyboardHeight: 0,
    keyboardOpen: false,
    supportsVisualViewport: false,
    lastEvent: "init",
  };
}

export function useKeyboardViewport<T extends HTMLElement = HTMLTextAreaElement>(
  options: UseKeyboardViewportOptions = {}
): UseKeyboardViewportResult<T> {
  const {
    keyboardOpenThreshold = 100,
    maxLift = 320,
    baseContentPadding = 96,
    iosFocusDelay = 320,
    defaultFocusDelay = 120,
    blurDelay = 120,
    restoreScrollOnIOSBlur = true,
    scrollOnFocus = true,
    scrollIntoViewOptions = {
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    },
    onFocusSettled,
  } = options;

  const inputRef = useRef<T | null>(null);
  const baselineHeightRef = useRef(0);
  const restoreScrollTopRef = useRef(0);
  const focusTimerRef = useRef<number | null>(null);
  const blurTimerRef = useRef<number | null>(null);
  const onFocusSettledRef = useRef(onFocusSettled);

  const [focusCount, setFocusCount] = useState(0);
  const [blurCount, setBlurCount] = useState(0);

  const platform = useMemo(() => {
    if (typeof navigator === "undefined") return "Other" as KeyboardPlatform;
    return detectPlatform();
  }, []);

  const [metrics, setMetrics] = useState<KeyboardViewportMetrics>(() =>
    createInitialMetrics(platform)
  );

  onFocusSettledRef.current = onFocusSettled;

  const remeasure = useCallback(
    (eventName = "manual") => {
      if (typeof window === "undefined") return;

      const viewport = window.visualViewport;
      const visualHeight = viewport?.height ?? null;
      const offsetTop = viewport?.offsetTop ?? null;
      const currentInnerHeight = window.innerHeight;
      const effectiveHeight = visualHeight ?? currentInnerHeight;

      if (baselineHeightRef.current === 0) {
        baselineHeightRef.current = effectiveHeight;
      }

      if (effectiveHeight > baselineHeightRef.current) {
        baselineHeightRef.current = effectiveHeight;
      }

      let keyboardHeight = Math.max(
        0,
        baselineHeightRef.current - effectiveHeight - (offsetTop ?? 0)
      );

      if (!viewport && platform === "Android") {
        keyboardHeight = Math.max(
          0,
          baselineHeightRef.current - currentInnerHeight
        );
      }

      const keyboardOpen = keyboardHeight > keyboardOpenThreshold;

      if (!keyboardOpen && effectiveHeight >= baselineHeightRef.current - 16) {
        baselineHeightRef.current = Math.max(
          baselineHeightRef.current,
          effectiveHeight
        );
      }

      setMetrics({
        platform,
        innerHeight: Math.round(currentInnerHeight),
        visualViewportHeight: roundValue(visualHeight),
        visualViewportOffsetTop: roundValue(offsetTop),
        keyboardHeight: Math.round(keyboardHeight),
        keyboardOpen,
        supportsVisualViewport: Boolean(viewport),
        lastEvent: eventName,
      });
    },
    [keyboardOpenThreshold, platform]
  );

  useEffect(() => {
    const handleWindowResize = () => remeasure("window.resize");
    const handleViewportResize = () => remeasure("visualViewport.resize");
    const handleViewportScroll = () => remeasure("visualViewport.scroll");

    remeasure("init");
    window.addEventListener("resize", handleWindowResize);
    window.visualViewport?.addEventListener("resize", handleViewportResize);
    window.visualViewport?.addEventListener("scroll", handleViewportScroll);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportScroll);

      if (focusTimerRef.current !== null) {
        window.clearTimeout(focusTimerRef.current);
      }

      if (blurTimerRef.current !== null) {
        window.clearTimeout(blurTimerRef.current);
      }
    };
  }, [remeasure]);

  const handleFocus = () => {
    if (typeof window === "undefined") return;

    restoreScrollTopRef.current = window.scrollY;
    setFocusCount((count) => count + 1);

    if (focusTimerRef.current !== null) {
      window.clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = window.setTimeout(() => {
      if (scrollOnFocus) {
        inputRef.current?.scrollIntoView(scrollIntoViewOptions);
      }

      onFocusSettledRef.current?.();
      remeasure("focus.settled");
    }, platform === "iOS" ? iosFocusDelay : defaultFocusDelay);
  };

  const handleBlur = () => {
    if (typeof window === "undefined") return;

    setBlurCount((count) => count + 1);

    if (blurTimerRef.current !== null) {
      window.clearTimeout(blurTimerRef.current);
    }

    blurTimerRef.current = window.setTimeout(() => {
      if (platform === "iOS" && restoreScrollOnIOSBlur) {
        window.scrollTo({ top: restoreScrollTopRef.current, behavior: "smooth" });
      }

      remeasure("blur.settled");
    }, blurDelay);
  };

  const footerLift = Math.min(metrics.keyboardHeight, maxLift);
  const contentPaddingBottom = baseContentPadding + footerLift;

  return {
    inputRef,
    metrics,
    focusCount,
    blurCount,
    footerLift,
    contentPaddingBottom,
    handleFocus,
    handleBlur,
    remeasure,
    bindInput: {
      ref: inputRef,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}