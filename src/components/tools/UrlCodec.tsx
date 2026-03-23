import { useState, useCallback } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

export default function UrlCodec() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = useCallback(() => {
    setOutput(encodeURIComponent(input));
  }, [input]);

  const decode = useCallback(() => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("解码失败：输入不是有效的编码字符串");
    }
  }, [input]);

  const encodeAll = useCallback(() => {
    setOutput(encodeURI(input));
  }, [input]);

  const decodeAll = useCallback(() => {
    try {
      setOutput(decodeURI(input));
    } catch {
      setOutput("解码失败：输入不是有效的编码字符串");
    }
  }, [input]);

  return (
    <ToolPage
      title="URL 编解码"
      description="URL 编码与解码（encodeURIComponent / encodeURI）"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            输入
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入 URL 或编码后的字符串..."
            rows={10}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              resize: "vertical",
            }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={encode}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ background: "var(--color-primary)" }}
            >
              encodeURIComponent
            </button>
            <button
              onClick={decode}
              className="rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                background: "var(--color-bg-secondary)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              decodeURIComponent
            </button>
            <button
              onClick={encodeAll}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ background: "var(--color-accent)" }}
            >
              encodeURI
            </button>
            <button
              onClick={decodeAll}
              className="rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                background: "var(--color-bg-secondary)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              decodeURI
            </button>
          </div>
        </div>
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
            className="min-h-[15rem] overflow-auto rounded-lg p-3 text-sm break-all whitespace-pre-wrap"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {output || "结果将显示在这里"}
          </pre>
        </div>
      </div>
    </ToolPage>
  );
}
