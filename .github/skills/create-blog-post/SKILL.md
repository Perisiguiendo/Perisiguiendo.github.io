---
name: create-blog-post
description: "Create a new blog post for cruel.run. Use when: writing a new article, adding a blog post, creating MDX content. Triggers: new post, new blog, write article, create post, 写博客, 新文章."
argument-hint: "Post title and topic, e.g. 'TypeScript 类型体操入门'"
---

# Create Blog Post

## When to Use

- 需要创建一篇新的博客文章
- 用户要求撰写或添加博客内容

## Procedure

### Step 1: Create MDX File

在 `src/content/blog/` 下创建 `.mdx` 文件。文件名使用 kebab-case 英文命名（作为 URL slug）。

**Frontmatter 模板（必填字段标注）：**

```yaml
---
title: "文章标题"         # 必填，中文
description: "文章摘要"   # 推荐，用于 SEO 和文章卡片
date: 2024-01-01          # 必填，YYYY-MM-DD 格式
tags: ["标签1", "标签2"]  # 推荐，用于分类和标签页
cover: "/images/cover.jpg" # 可选，封面图片路径
draft: false               # 可选，默认 false；true 表示草稿不发布
---
```

**Schema 定义参考：** [content.config.ts](../../src/content.config.ts)

### Step 2: Write Content

使用 Markdown + MDX 语法撰写正文内容。

**格式要求：**

- 使用 `##` (h2) 和 `###` (h3) 作为章节标题（TOC 基于 h2/h3 自动生成）
- 代码块指定语言以启用 Shiki 高亮：` ```typescript `
- 图片放在 `public/images/` 目录，引用路径为 `/images/xxx.jpg`
- 可导入并使用 React 组件（MDX 特性）

**内容规范：**

- 语言：中文为主
- 段落间保留空行
- 代码示例需完整可运行
- 适当添加小标题分段，利于 TOC 导航

### Step 3: Verify

1. 确认文件名为 kebab-case（将成为 URL：`/blog/file-name`）
2. 确认 `date` 格式正确（YYYY-MM-DD）
3. 运行 `npm run build` 确认构建通过
4. 检查输出中出现 `/blog/your-slug/index.html`

**现有文章参考：** [hexo-setup.mdx](../../src/content/blog/hexo-setup.mdx)

## Routing

文章通过 `src/pages/blog/[slug].astro` 动态路由，slug 取自文件名（不含扩展名）。

- 文件 `src/content/blog/my-post.mdx` → URL `/blog/my-post`
- 自动出现在博客列表 `/blog`、标签页 `/tags/[tag]`、首页最新文章、RSS 订阅

## Checklist

- [ ] MDX 文件创建在 `src/content/blog/`
- [ ] 文件名为 kebab-case 英文
- [ ] frontmatter 包含 `title` 和 `date`
- [ ] 使用 h2/h3 划分章节
- [ ] `npm run build` 通过
