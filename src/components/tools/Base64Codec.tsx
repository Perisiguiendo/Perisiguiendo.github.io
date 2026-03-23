import { useState, useCallback, useRef } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

export default function Base64Codec() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const encode = useCallback(() => {
    try {
      const encoded = btoa(
        new TextEncoder()
          .encode(input)
          .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
      );
      setOutput(encoded);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input]);

  const decode = useCallback(() => {
    try {
      const bytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
      setError("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOutput(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <ToolPage title="Base64 编解码" description="文本/图片 Base64 互转">
      {/* Mode toggle */}
      <div className="mb-4 flex gap-2">
        {(["text", "file"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setOutput("");
              setError("");
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              background:
                mode === m
                  ? "var(--color-primary)"
                  : "var(--color-bg-secondary)",
              color: mode === m ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${mode === m ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            {m === "text" ? "文本模式" : "文件模式"}
          </button>
        ))}
      </div>

      {mode === "text" ? (
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
              placeholder="输入文本或 Base64 字符串..."
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
            <div className="mt-3 flex gap-3">
              <button
                onClick={encode}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: "var(--color-primary)" }}
              >
                编码 →
              </button>
              <button
                onClick={decode}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                ← 解码
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
              className="min-h-[18rem] overflow-auto rounded-lg p-3 text-sm break-all whitespace-pre-wrap"
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
      ) : (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="flex min-h-[12rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <span className="mb-2 text-3xl">📁</span>
            <p className="text-sm">拖拽文件到这里，或点击选择文件</p>
            <input
              ref={fileRef}
              type="file"
              onChange={handleFile}
              className="hidden"
            />
          </div>
          {output && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  Base64 Data URL
                </label>
                <CopyButton text={output} />
              </div>
              <pre
                className="overflow-auto rounded-lg p-3 text-xs break-all whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-code)",
                  background: "var(--color-code-bg)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  maxHeight: "16rem",
                }}
              >
                {output}
              </pre>
              {output.startsWith("data:image") && (
                <img
                  src={output}
                  alt="Preview"
                  className="mt-4 max-h-64 rounded-lg"
                  style={{ border: "1px solid var(--color-border)" }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </ToolPage>
  );
}
