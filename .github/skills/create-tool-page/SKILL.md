---
name: create-tool-page
description: "Create a new tool page for the cruel.run toolbox. Use when: adding a new tool, creating a new utility page, building an interactive React tool component. Triggers: new tool, add tool, create tool, toolbox."
argument-hint: "Tool name and brief description, e.g. 'Hash Generator - 文本哈希计算工具'"
---

# Create Tool Page

## When to Use

- 需要在工具箱中添加一个新的在线工具
- 用户要求创建新的实用工具页面

## Procedure

### Step 1: Create React Component

在 `src/components/tools/` 下创建新的 React 组件文件（PascalCase 命名，`.tsx` 扩展名）。

**必须遵循的模式：**

```tsx
import { useState } from 'react';
import ToolPage from './ToolPage';
import CopyButton from './CopyButton';

export default function MyToolName() {
  // 状态管理...

  return (
    <ToolPage title="工具中文名" description="工具简短描述">
      {/* 工具 UI */}
    </ToolPage>
  );
}
```

**样式规则：**

- 布局用 Tailwind 类名（`className`）
- 颜色**必须**用 CSS 变量：`style={{ color: 'var(--color-text)' }}`
- 可用变量参考 [global.css](../../src/styles/global.css)：
  - `--color-text`, `--color-text-secondary`, `--color-text-muted`
  - `--color-bg`, `--color-bg-secondary`, `--color-bg-card`
  - `--color-primary`, `--color-primary-hover`, `--color-accent`
  - `--color-border`, `--color-code-bg`
  - `--font-code`, `--font-heading`, `--font-body`
- 输入框统一样式：`rounded-lg p-3 text-sm` + border/background 变量
- 按钮主色：`background: 'var(--color-primary)'`, 文字白色
- 按钮次色：`background: 'var(--color-bg-secondary)'` + border
- 有输出文本时，提供 `<CopyButton text={output} />` 复制按钮

**参考现有示例：** [JsonFormatter.tsx](../../src/components/tools/JsonFormatter.tsx)

### Step 2: Create Astro Page

在 `src/pages/tools/` 下创建 Astro 页面文件（kebab-case 命名，`.astro` 扩展名）。

**固定模板：**

```astro
---
import ToolLayout from '../../layouts/ToolLayout.astro';
import MyToolName from '../../components/tools/MyToolName';
---

<ToolLayout title="工具中文名" description="工具简短描述">
  <MyToolName client:load />
</ToolLayout>
```

- `client:load` 是必须的，确保 React 组件在客户端水合
- `title` 和 `description` 与 React 组件中的 `ToolPage` props 保持一致

### Step 3: Register in Sidebar

编辑 `src/layouts/ToolLayout.astro`，在 `tools` 数组中添加新工具条目：

```typescript
{ name: '工具中文名', href: '/tools/my-tool', icon: '🔧', description: '工具简短描述' },
```

同时编辑 `src/pages/tools/index.astro`，在对应分类中添加工具卡片条目（含 `category` 字段）。

### Step 4: Verify

运行 `npm run build` 确认构建通过，确保生成了 `/tools/my-tool/index.html`。

## Checklist

- [ ] React 组件创建在 `src/components/tools/`
- [ ] 使用 `ToolPage` 包裹器
- [ ] 颜色全部使用 CSS 变量，无硬编码色值
- [ ] Astro 页面创建在 `src/pages/tools/`，使用 `client:load`
- [ ] `ToolLayout.astro` 侧边栏已注册
- [ ] `tools/index.astro` 首页已注册
- [ ] `npm run build` 通过
