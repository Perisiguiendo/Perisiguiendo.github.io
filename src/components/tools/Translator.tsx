import { useState, useEffect } from "react";
import ToolPage from "./ToolPage";
import CopyButton from "./CopyButton";

export default function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("zh");
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for Chrome Translation API availability
    const check = async () => {
      try {
        if (
          "translation" in self &&
          typeof (self as any).translation?.canTranslate === "function"
        ) {
          const result = await (self as any).translation.canTranslate({
            sourceLanguage: "en",
            targetLanguage: "zh",
          });
          setIsSupported(result === "readily" || result === "after-download");
        } else {
          setIsSupported(false);
        }
      } catch {
        setIsSupported(false);
      }
    };
    check();
  }, []);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      if (isSupported) {
        const translator = await (self as any).translation.createTranslator({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
        const result = await translator.translate(input);
        setOutput(result);
      } else {
        setError(
          '当前浏览器不支持 Translation API。请使用 Chrome 131+ 版本，并在 chrome://flags 中启用 "Translation API"。',
        );
      }
    } catch (e) {
      setError(`翻译失败: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const langOptions = [
    { value: "en", label: "English" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" },
    { value: "pt", label: "Português" },
    { value: "ru", label: "Русский" },
  ];

  const swap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolPage
      title="翻译"
      description="浏览器端翻译工具（Chrome Translation API）"
    >
      {isSupported === false && (
        <div
          className="mb-4 rounded-lg p-4 text-sm"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          ⚠️ 当前浏览器不支持 Translation API。需要 Chrome 131+ 并在
          <code
            className="mx-1 rounded px-1"
            style={{ background: "rgba(239, 68, 68, 0.15)" }}
          >
            chrome://flags/#translation-api
          </code>
          中启用。
        </div>
      )}

      {/* Language selector */}
      <div className="mb-4 flex items-center gap-3">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          {langOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={swap}
          className="rounded-lg p-2 text-sm transition-transform hover:scale-110"
          style={{
            background: "var(--color-bg-secondary)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          ⇄
        </button>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
        >
          {langOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            原文
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要翻译的文本..."
            rows={10}
            className="w-full rounded-lg p-3 text-sm"
            style={{
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              resize: "vertical",
            }}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              译文
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <div
            className="min-h-[15rem] rounded-lg p-3 text-sm whitespace-pre-wrap"
            style={{
              background: "var(--color-code-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {output || "翻译结果将显示在这里"}
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <button
        onClick={translate}
        disabled={loading || !input.trim()}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        style={{ background: "var(--color-primary)" }}
      >
        {loading ? "翻译中..." : "翻译"}
      </button>
    </ToolPage>
  );
}
