import { useState, useCallback } from "react";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
      style={{
        background: copied
          ? "var(--color-accent)"
          : "var(--color-bg-secondary)",
        color: copied ? "white" : "var(--color-text-secondary)",
        border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border)"}`,
      }}
    >
      {copied ? "✓ 已复制" : "复制"}
    </button>
  );
}
