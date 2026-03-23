import { useState } from "react";
import { marked } from "marked";
import ToolPage from "./ToolPage";

const defaultMd = `# 标题

这是一段 **Markdown** 文本。

## 列表

- 项目一
- 项目二
- 项目三

## 代码

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 引用文本

[链接](https://cruel.run)
`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(defaultMd);

  const html = marked.parse(input, { async: false }) as string;

  return (
    <ToolPage title="Markdown 预览" description="实时 Markdown 编辑与预览">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            编辑
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
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
            预览
          </label>
          <div
            className="prose min-h-[30rem] overflow-auto rounded-lg p-4"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolPage>
  );
}
