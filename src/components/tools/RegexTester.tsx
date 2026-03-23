import { useState, useMemo } from "react";
import ToolPage from "./ToolPage";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    if (!pattern || !testStr) return [];
    try {
      const re = new RegExp(pattern, flags);
      setError("");
      const results: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((m = re.exec(testStr)) !== null) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
          if (m[0].length === 0) re.lastIndex++; // prevent infinite loop
        }
      } else {
        m = re.exec(testStr);
        if (m) {
          results.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }
      return results;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testStr]);

  // Build highlighted HTML
  const highlighted = useMemo(() => {
    if (!pattern || !testStr || matches.length === 0) return null;
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const parts: { text: string; isMatch: boolean }[] = [];
      let lastIdx = 0;
      let m: RegExpExecArray | null;

      while ((m = re.exec(testStr)) !== null) {
        if (m.index > lastIdx) {
          parts.push({ text: testStr.slice(lastIdx, m.index), isMatch: false });
        }
        parts.push({ text: m[0], isMatch: true });
        lastIdx = m.index + m[0].length;
        if (m[0].length === 0) {
          re.lastIndex++;
          lastIdx++;
        }
      }
      if (lastIdx < testStr.length) {
        parts.push({ text: testStr.slice(lastIdx), isMatch: false });
      }
      return parts;
    } catch {
      return null;
    }
  }, [pattern, flags, testStr, matches]);

  const flagOptions = ["g", "i", "m", "s"];

  return (
    <ToolPage title="正则表达式测试" description="实时匹配高亮 + 分组提取">
      {/* Pattern + flags */}
      <div className="mb-4 flex items-end gap-3">
        <div className="flex-1">
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            正则表达式
          </label>
          <div
            className="flex items-center rounded-lg"
            style={{
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span
              className="pl-3 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              /
            </span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="输入正则..."
              className="flex-1 bg-transparent p-2.5 text-sm outline-none"
              style={{
                fontFamily: "var(--font-code)",
                color: "var(--color-text)",
              }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              /
            </span>
            <span
              className="pr-3 text-sm"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-code)",
              }}
            >
              {flags}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {flagOptions.map((f) => (
            <button
              key={f}
              onClick={() =>
                setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f)
              }
              className="size-9 rounded-md text-sm font-mono font-medium"
              style={{
                background: flags.includes(f)
                  ? "var(--color-primary)"
                  : "var(--color-bg-secondary)",
                color: flags.includes(f)
                  ? "white"
                  : "var(--color-text-secondary)",
                border: `1px solid ${flags.includes(f) ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

      {/* Test string */}
      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          测试文本
        </label>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          placeholder="输入要测试的文本..."
          rows={6}
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

      {/* Highlighted result */}
      {highlighted && (
        <div className="mb-4">
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            匹配高亮
          </label>
          <pre
            className="rounded-lg p-3 text-sm whitespace-pre-wrap break-all"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {highlighted.map((part, i) =>
              part.isMatch ? (
                <mark
                  key={i}
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    color: "var(--color-primary)",
                    borderRadius: "2px",
                    padding: "0 2px",
                  }}
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </pre>
        </div>
      )}

      {/* Match results */}
      {matches.length > 0 && (
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            匹配结果 ({matches.length} 个)
          </label>
          <div className="space-y-1">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md px-3 py-1.5 text-xs"
                style={{
                  fontFamily: "var(--font-code)",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text)",
                }}
              >
                <span style={{ color: "var(--color-text-muted)" }}>
                  #{i + 1}
                </span>
                <span style={{ color: "var(--color-primary)" }}>
                  "{m.match}"
                </span>
                <span style={{ color: "var(--color-text-muted)" }}>
                  index: {m.index}
                </span>
                {m.groups.length > 0 && (
                  <span style={{ color: "var(--color-accent)" }}>
                    groups: [{m.groups.map((g) => `"${g}"`).join(", ")}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPage>
  );
}
