import { useState } from "react";
import { diffLines, diffWords } from "diff";
import ToolPage from "./ToolPage";

export default function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<"line" | "word">("line");
  const [result, setResult] = useState<
    { value: string; added?: boolean; removed?: boolean }[]
  >([]);

  const compare = () => {
    const fn = mode === "line" ? diffLines : diffWords;
    setResult(fn(left, right));
  };

  return (
    <ToolPage title="文本差异对比" description="行级/字级 Diff 高亮">
      <div className="mb-4 flex gap-2">
        {(["line", "word"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{
              background:
                mode === m
                  ? "var(--color-primary)"
                  : "var(--color-bg-secondary)",
              color: mode === m ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${mode === m ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {m === "line" ? "行级对比" : "字级对比"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            原始文本
          </label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="输入原始文本..."
            rows={12}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              resize: "vertical",
            }}
          />
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            对比文本
          </label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="输入对比文本..."
            rows={12}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      <button
        onClick={compare}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--color-primary)" }}
      >
        对比
      </button>

      {result.length > 0 && (
        <div className="mt-4">
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            差异结果
          </label>
          <pre
            className="overflow-auto rounded-lg p-3 text-sm whitespace-pre-wrap"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {result.map((part, i) => (
              <span
                key={i}
                style={{
                  background: part.added
                    ? "rgba(34, 197, 94, 0.2)"
                    : part.removed
                      ? "rgba(239, 68, 68, 0.2)"
                      : "transparent",
                  color: part.added
                    ? "#22c55e"
                    : part.removed
                      ? "#ef4444"
                      : "inherit",
                  textDecoration: part.removed ? "line-through" : "none",
                }}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
      )}
    </ToolPage>
  );
}
