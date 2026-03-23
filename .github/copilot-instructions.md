# Project Guidelines

## Overview

个人博客与工具箱网站 cruel.run，基于 Astro 6 构建，支持多主题切换（minimal / cyberpunk / literary × light / dark）。

## Tech Stack

- **Framework**: Astro 6 (静态站点生成，Island Architecture)
- **UI**: Tailwind CSS 4（通过 `@tailwindcss/vite`，非 `@astrojs/tailwind`）
- **交互组件**: React 19（通过 `@astrojs/react`，仅工具箱页面使用 `client:load`）
- **内容**: MDX + Content Collections（glob loader）
- **代码高亮**: Shiki（内置，github-light / one-dark-pro 双主题）
- **搜索**: Pagefind（构建后索引）
- **部署**: GitHub Pages + GitHub Actions

## Project Structure

```
src/
├── content/blog/          # MDX 博客文章（glob loader 扫描）
├── components/            # Astro 组件（Header, Footer, TOC, PostCard, ThemeSwitcher）
│   └── tools/             # React 工具组件（JsonFormatter, Base64Codec 等）
├── layouts/
│   ├── BaseLayout.astro   # 根布局（SEO, 字体, 主题初始化, ClientRouter）
│   ├── BlogPost.astro     # 博客文章布局（含 TOC 侧边栏）
│   └── ToolLayout.astro   # 工具箱布局（含工具侧边导航）
├── pages/
│   ├── blog/              # 博客列表 + [slug] 动态路由
│   ├── tags/              # 标签列表 + [tag] 动态路由
│   ├── tools/             # 工具箱首页 + 各工具页面
│   ├── search.astro       # Pagefind 搜索页
│   └── rss.xml.ts         # RSS 订阅源
├── styles/global.css      # 主题系统（CSS 自定义属性, 3 主题 × 2 模式）
└── utils/theme.ts         # 主题工具函数
```

## Code Style

- 中文内容使用 `lang="zh-CN"`
- Astro 组件内样式使用 CSS 自定义属性 `var(--color-*)` 而非硬编码颜色
- React 工具组件内通过 `style={{ color: 'var(--color-text)' }}` 使用主题变量
- Tailwind 用于布局和间距，主题色走 CSS 变量
- 博客文章使用 `.mdx` 格式，frontmatter 遵循 `src/content.config.ts` 中的 schema

## Architecture Conventions

- **Astro 6 Content Collections**: 使用 `glob()` loader，不能用废弃的 `type: "content"`
- **View Transitions**: 使用 `ClientRouter`（非旧版 `ViewTransitions`）
- **工具组件**: 每个工具是独立的 React 组件在 `src/components/tools/`，通过 Astro 页面包裹并用 `client:load` 水合
- **主题切换**: `data-theme` + `data-mode` 属性在 `<html>` 上，通过 `localStorage` 持久化

## Build & Dev

```bash
npm run dev      # 本地开发服务器 (localhost:4321)
npm run build    # 构建静态站点到 dist/
npm run preview  # 预览构建结果
```

## Tool Page Convention

工具页面 Astro 文件位于 `src/pages/tools/`，结构统一：

```astro
---
import ToolLayout from '../../layouts/ToolLayout.astro';
import MyTool from '../../components/tools/MyTool';
---
<ToolLayout title="工具名" description="工具描述">
  <MyTool client:load />
</ToolLayout>
```

React 组件使用 `ToolPage` 包裹器提供标题和描述，所有状态管理在客户端，不依赖后端。

## Blog Post Convention

博客 MDX 文件位于 `src/content/blog/`，frontmatter schema:

```yaml
title: string          # 必填
description: string    # 可选
date: date             # 必填 (YYYY-MM-DD)
tags: string[]         # 默认 []
cover: string          # 可选 (图片路径)
draft: boolean         # 默认 false
```
