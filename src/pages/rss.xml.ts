import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "cruel.run",
    description: "个人博客与工具箱",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
