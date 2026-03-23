import { useState } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolPage title="JSON 格式化" description="JSON 美化、压缩、校验">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              输入
            </label>
            <div className="flex items-center gap-2">
              <label
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                缩进
              </label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded-md px-2 py-1 text-xs"
                style={{
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <option value={2}>2 空格</option>
                <option value={4}>4 空格</option>
                <option value={1}>Tab</option>
              </select>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="粘贴 JSON..."
            rows={16}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: `1px solid ${error ? "#ef4444" : "var(--color-border)"}`,
              resize: "vertical",
            }}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              输出
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <pre
            className="min-h-[24rem] overflow-auto rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {output || "格式化结果将显示在这里"}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={format}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--color-primary)" }}
        >
          格式化
        </button>
        <button
          onClick={minify}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          压缩
        </button>
      </div>
    </ToolPage>
  );
}
