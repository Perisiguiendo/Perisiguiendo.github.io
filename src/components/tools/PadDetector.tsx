import { useState, useEffect, useCallback } from "react";
import ToolPage from "./ToolPage";

const STORAGE_KEY = "pad-detector-threshold";
const DEFAULT_THRESHOLD = 700;

function getStoredThreshold(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const n = Number(v);
      if (n > 0 && n < 10000) return n;
    }
  } catch {}
  return DEFAULT_THRESHOLD;
}

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  innerWidth: number;
  innerHeight: number;
  dpr: number;
  minSide: number;
  orientation: string;
  touchPoints: number;
  isFoldable: boolean;
  foldExpanded: boolean;
}

function getScreenInfo(): ScreenInfo {
  const sw = window.screen.width;
  const sh = window.screen.height;
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const dpr = window.devicePixelRatio;
  const minSide = Math.min(sw, sh);
  const orientation =
    typeof screen.orientation !== "undefined"
      ? screen.orientation.type
      : iw > ih
        ? "landscape"
        : "portrait";
  const touchPoints = navigator.maxTouchPoints || 0;

  // Foldable detection heuristics
  // 1. Screen Fold API (experimental)
  const hasFoldApi = "getScreenDetails" in window || "visualViewport" in window;
  // 2. Check aspect ratio change pattern typical of foldables
  const aspectRatio = Math.max(sw, sh) / Math.min(sw, sh);
  const isFoldable = touchPoints > 0 && (hasFoldApi || aspectRatio < 1.5);
  // When a foldable is unfolded, innerWidth often approaches or exceeds screen.width
  // and the aspect ratio becomes close to 1:1
  const viewAspect = Math.max(iw, ih) / Math.min(iw, ih);
  const foldExpanded = isFoldable && viewAspect < 1.4 && Math.min(iw, ih) > 500;

  return {
    screenWidth: sw,
    screenHeight: sh,
    innerWidth: iw,
    innerHeight: ih,
    dpr,
    minSide,
    orientation,
    touchPoints,
    isFoldable,
    foldExpanded,
  };
}

export default function PadDetector() {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [inputValue, setInputValue] = useState(String(DEFAULT_THRESHOLD));
  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const update = useCallback(() => {
    setInfo(getScreenInfo());
  }, []);

  useEffect(() => {
    setThreshold(getStoredThreshold());
    setInputValue(String(getStoredThreshold()));
    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", () => setTimeout(update, 100));
    const timer = setInterval(update, 1000);
    return () => {
      window.removeEventListener("resize", update);
      clearInterval(timer);
    };
  }, [update]);

  const handleThresholdChange = (val: string) => {
    setInputValue(val);
    const n = Number(val);
    if (n > 0 && n < 10000) {
      setThreshold(n);
      try {
        localStorage.setItem(STORAGE_KEY, String(n));
      } catch {}
    }
  };

  const resetThreshold = () => {
    setThreshold(DEFAULT_THRESHOLD);
    setInputValue(String(DEFAULT_THRESHOLD));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (!info) return null;

  const isPad = info.minSide > threshold;
  const treatAsPad = isPad || info.foldExpanded;

  return (
    <ToolPage
      title="Pad 检测"
      description="检测当前设备是否为平板尺寸，支持折叠屏展开检测"
    >
      {/* Result Banner */}
      <div
        className="mb-6 rounded-xl p-5 text-center text-xl font-bold"
        style={{
          background: treatAsPad
            ? "color-mix(in srgb, #22c55e 15%, transparent)"
            : "color-mix(in srgb, #ef4444 15%, transparent)",
          color: treatAsPad ? "#16a34a" : "#dc2626",
        }}
      >
        {treatAsPad
          ? "✅ isPad = true（Pad 布局）"
          : "❌ isPad = false（Phone 布局）"}
        {info.foldExpanded && !isPad && (
          <div
            className="mt-1 text-sm font-normal"
            style={{ color: "var(--color-text-secondary)" }}
          >
            折叠屏展开状态 → 视为 Pad
          </div>
        )}
      </div>

      {/* Screen Info Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(
          [
            ["screen.width", info.screenWidth],
            ["screen.height", info.screenHeight],
            ["innerWidth", info.innerWidth],
            ["innerHeight", info.innerHeight],
            ["devicePixelRatio", info.dpr],
            ["Math.min(w,h)", info.minSide],
            ["maxTouchPoints", info.touchPoints],
            [
              "orientation",
              info.orientation.replace(/-primary|-secondary/g, ""),
            ],
          ] as [string, string | number][]
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border p-3"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {label}
            </div>
            <div
              className="mt-1 text-lg font-semibold"
              style={{
                fontFamily: "var(--font-code)",
                color: "var(--color-text)",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Foldable Status */}
      <div
        className="mb-6 rounded-lg border p-4"
        style={{
          background: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
          borderLeft: `3px solid ${info.isFoldable ? "var(--color-accent)" : "var(--color-border)"}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              折叠屏检测
            </div>
            <div
              className="mt-1 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {info.isFoldable
                ? info.foldExpanded
                  ? "📖 折叠屏已展开 — 使用 Pad 布局"
                  : "📱 折叠屏已折叠 — 使用 Phone 布局"
                : "非折叠屏设备"}
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: info.isFoldable
                ? "color-mix(in srgb, var(--color-accent) 15%, transparent)"
                : "var(--color-bg-secondary)",
              color: info.isFoldable
                ? "var(--color-accent)"
                : "var(--color-text-muted)",
            }}
          >
            {info.isFoldable ? "折叠屏" : "普通设备"}
          </div>
        </div>
      </div>

      {/* Threshold Config */}
      <div
        className="mb-6 rounded-lg border p-4"
        style={{
          background: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="mb-3 text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          自定义检测阈值
        </div>
        <div className="flex items-center gap-3">
          <label
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            PAD_WIDTH_RATIO
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleThresholdChange(e.target.value)}
            min={100}
            max={9999}
            className="w-24 rounded-lg px-3 py-2 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          />
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            px
          </span>
          <button
            onClick={resetThreshold}
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            重置为 {DEFAULT_THRESHOLD}
          </button>
        </div>
        <div
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          判断逻辑：
          <code
            style={{
              background: "var(--color-code-bg)",
              padding: "1px 4px",
              borderRadius: "3px",
            }}
          >
            Math.min(screen.width, screen.height) &gt; {threshold}
          </code>
          {" → "}当前 {info.minSide} {isPad ? ">" : "≤"} {threshold}
        </div>
      </div>

      {/* Guide Toggle */}
      <div className="mb-2">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-sm font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          {showGuide ? "▼" : "▶"} 折叠屏检测说明 & 实现参考
        </button>
      </div>

      {showGuide && (
        <div
          className="rounded-lg border p-5 text-sm leading-relaxed"
          style={{
            background: "var(--color-bg-card)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <h3
            className="mb-3 text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            如何检测折叠屏展开状态
          </h3>

          <p className="mb-2">
            <strong style={{ color: "var(--color-text)" }}>
              方案一：Screen Fold API（实验性）
            </strong>
          </p>
          <pre
            className="mb-3 overflow-auto rounded-lg p-3 text-xs"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
            }}
          >{`// 需要 Chrome 125+ & Foldable 设备
const segments = await window.getScreenDetails();
// 多段屏幕 = 展开状态
if (segments.screens.length > 1) {
  // 展开 → 使用 Pad 布局
}`}</pre>

          <p className="mb-2">
            <strong style={{ color: "var(--color-text)" }}>
              方案二：视口宽高比启发式（推荐）
            </strong>
          </p>
          <pre
            className="mb-3 overflow-auto rounded-lg p-3 text-xs"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
            }}
          >{`function isFoldExpanded() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isTouchDevice = navigator.maxTouchPoints > 0;
  const aspectRatio = Math.max(w, h) / Math.min(w, h);
  // 展开后宽高比接近 1:1，且短边 > 500px
  return isTouchDevice && aspectRatio < 1.4
    && Math.min(w, h) > 500;
}

function isPad(threshold = 700) {
  const minSide = Math.min(screen.width, screen.height);
  return minSide > threshold || isFoldExpanded();
}`}</pre>

          <p className="mb-2">
            <strong style={{ color: "var(--color-text)" }}>
              方案三：CSS 媒体查询
            </strong>
          </p>
          <pre
            className="mb-3 overflow-auto rounded-lg p-3 text-xs"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
            }}
          >{`/* 折叠屏展开：触摸设备 + 最小宽度 + 接近正方形 */
@media (pointer: coarse)
  and (min-width: 600px)
  and (max-aspect-ratio: 7/5) {
  /* Pad / 折叠屏展开布局 */
}`}</pre>

          <p className="mb-2">
            <strong style={{ color: "var(--color-text)" }}>
              方案四：resize 事件监听
            </strong>
          </p>
          <pre
            className="mb-3 overflow-auto rounded-lg p-3 text-xs"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
            }}
          >{`// 折叠屏展开/折叠时会触发 resize
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  // 宽度跳变幅度大 → 可能是折叠/展开
  if (Math.abs(newWidth - lastWidth) > 200) {
    console.log('可能发生折叠/展开');
    // 重新判断布局
  }
  lastWidth = newWidth;
});`}</pre>

          <h3
            className="mb-2 mt-4 text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            折叠屏设备特征
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Galaxy Z Fold</strong>：折叠 375×812 → 展开 768×1024（类似
              iPad mini）
            </li>
            <li>
              <strong>Pixel Fold</strong>：折叠 360×780 → 展开 841×736
            </li>
            <li>
              <strong>展开特征</strong>：短边突然增大、宽高比趋近
              1:1、innerWidth 大幅变化
            </li>
          </ul>

          <h3
            className="mb-2 mt-4 text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            最佳实践
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>
              将{" "}
              <code
                style={{
                  background: "var(--color-code-bg)",
                  padding: "1px 4px",
                  borderRadius: "3px",
                }}
              >
                isPad
              </code>{" "}
              结果注入到 CSS 变量或 class，驱动响应式布局
            </li>
            <li>监听 resize 事件实时更新判断，响应折叠/展开</li>
            <li>不要仅依赖 User-Agent，因为折叠屏 UA 与普通手机相同</li>
            <li>搭配 CSS Container Queries 可获得更灵活的组件级适配</li>
          </ul>
        </div>
      )}
    </ToolPage>
  );
}
