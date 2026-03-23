import { useState, useCallback } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex
    .replace("#", "")
    .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);
  const [h, setH] = useState(239);
  const [s, setS] = useState(84);
  const [l, setL] = useState(67);

  const updateFromHex = useCallback((val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      setR(rgb[0]);
      setG(rgb[1]);
      setB(rgb[2]);
      const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      setH(hsl[0]);
      setS(hsl[1]);
      setL(hsl[2]);
    }
  }, []);

  const updateFromRgb = useCallback((nr: number, ng: number, nb: number) => {
    setR(nr);
    setG(ng);
    setB(nb);
    setHex(rgbToHex(nr, ng, nb));
    const hsl = rgbToHsl(nr, ng, nb);
    setH(hsl[0]);
    setS(hsl[1]);
    setL(hsl[2]);
  }, []);

  const updateFromHsl = useCallback((nh: number, ns: number, nl: number) => {
    setH(nh);
    setS(ns);
    setL(nl);
    const rgb = hslToRgb(nh, ns, nl);
    setR(rgb[0]);
    setG(rgb[1]);
    setB(rgb[2]);
    setHex(rgbToHex(rgb[0], rgb[1], rgb[2]));
  }, []);

  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <ToolPage
      title="颜色转换器"
      description="HEX / RGB / HSL 互转 + 可视化调色板"
    >
      {/* Preview */}
      <div className="mb-6 flex items-center gap-6">
        <div
          className="size-24 rounded-xl shadow-lg"
          style={{
            backgroundColor: hex,
            border: "1px solid var(--color-border)",
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-sm"
              style={{ color: "var(--color-text)" }}
            >
              {hex}
            </span>
            <CopyButton text={hex} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-sm"
              style={{ color: "var(--color-text)" }}
            >
              {rgbStr}
            </span>
            <CopyButton text={rgbStr} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-sm"
              style={{ color: "var(--color-text)" }}
            >
              {hslStr}
            </span>
            <CopyButton text={hslStr} />
          </div>
        </div>
      </div>

      {/* Color picker */}
      <div className="mb-6">
        <input
          type="color"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="h-12 w-full cursor-pointer rounded-lg"
          style={{ border: "1px solid var(--color-border)" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* HEX */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            HEX
          </label>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full rounded-lg p-2.5 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          />
        </div>

        {/* RGB */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            RGB
          </label>
          <div className="flex gap-2">
            {[
              {
                val: r,
                set: (v: number) => updateFromRgb(v, g, b),
                label: "R",
                max: 255,
              },
              {
                val: g,
                set: (v: number) => updateFromRgb(r, v, b),
                label: "G",
                max: 255,
              },
              {
                val: b,
                set: (v: number) => updateFromRgb(r, g, v),
                label: "B",
                max: 255,
              },
            ].map(({ val, set, label, max }) => (
              <div key={label} className="flex-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={val}
                  onChange={(e) =>
                    set(Math.min(max, Math.max(0, Number(e.target.value))))
                  }
                  className="w-full rounded-md p-1.5 text-center text-xs"
                  style={{
                    fontFamily: "var(--font-code)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* HSL */}
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            HSL
          </label>
          <div className="flex gap-2">
            {[
              {
                val: h,
                set: (v: number) => updateFromHsl(v, s, l),
                label: "H",
                max: 360,
              },
              {
                val: s,
                set: (v: number) => updateFromHsl(h, v, l),
                label: "S",
                max: 100,
              },
              {
                val: l,
                set: (v: number) => updateFromHsl(h, s, v),
                label: "L",
                max: 100,
              },
            ].map(({ val, set, label, max }) => (
              <div key={label} className="flex-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={val}
                  onChange={(e) =>
                    set(Math.min(max, Math.max(0, Number(e.target.value))))
                  }
                  className="w-full rounded-md p-1.5 text-center text-xs"
                  style={{
                    fontFamily: "var(--font-code)",
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
