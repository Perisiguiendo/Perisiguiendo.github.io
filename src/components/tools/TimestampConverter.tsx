import { useState, useEffect } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [unit, setUnit] = useState<"s" | "ms">("s");

  useEffect(() => {
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const tsToDate = () => {
    const ts = Number(timestamp);
    if (isNaN(ts)) return;
    const ms = unit === "s" ? ts * 1000 : ts;
    const d = new Date(ms);
    setDateStr(
      d.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    );
  };

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setTimestamp(
      String(unit === "s" ? Math.floor(d.getTime() / 1000) : d.getTime()),
    );
  };

  const nowFormatted = new Date(now * 1000).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <ToolPage title="时间戳转换" description="Unix 时间戳 ↔ 日期格式互转">
      {/* Current time display */}
      <div
        className="mb-6 rounded-lg p-4 text-center"
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          当前时间
        </div>
        <div
          className="mt-1 font-mono text-lg font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {nowFormatted}
        </div>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span
            className="font-mono text-sm"
            style={{ color: "var(--color-primary)" }}
          >
            {now} (s) / {now * 1000} (ms)
          </span>
          <CopyButton text={String(now)} />
        </div>
      </div>

      {/* Unit selector */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          单位
        </span>
        {(["s", "ms"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className="rounded-md px-3 py-1 text-sm font-medium"
            style={{
              background:
                unit === u
                  ? "var(--color-primary)"
                  : "var(--color-bg-secondary)",
              color: unit === u ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${unit === u ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {u === "s" ? "秒 (s)" : "毫秒 (ms)"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            时间戳
          </label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder={unit === "s" ? "如: 1654329414" : "如: 1654329414000"}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          />
          <button
            onClick={tsToDate}
            className="mt-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--color-primary)" }}
          >
            时间戳 → 日期
          </button>
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            日期时间
          </label>
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            placeholder="如: 2022-06-04 16:16:54"
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          />
          <button
            onClick={dateToTs}
            className="mt-2 rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            日期 → 时间戳
          </button>
        </div>
      </div>
    </ToolPage>
  );
}
