import { useState } from "react";
import * as jsondiffpatch from "jsondiffpatch";
import ToolPage from "./ToolPage";

const differ = jsondiffpatch.create();

export default function JsonDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const compare = () => {
    try {
      const leftObj = JSON.parse(left);
      const rightObj = JSON.parse(right);
      const delta = differ.diff(leftObj, rightObj);
      if (!delta) {
        setResult("✅ 两个 JSON 完全相同");
      } else {
        setResult(JSON.stringify(delta, null, 2));
      }
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setResult("");
    }
  };

  return (
    <ToolPage title="JSON Diff" description="JSON 结构化差异对比">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            原始 JSON
          </label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="粘贴原始 JSON..."
            rows={14}
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
            对比 JSON
          </label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="粘贴对比 JSON..."
            rows={14}
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

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <button
        onClick={compare}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--color-primary)" }}
      >
        对比
      </button>

      {result && (
        <div className="mt-4">
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            差异结果
          </label>
          <pre
            className="overflow-auto rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </ToolPage>
  );
}
