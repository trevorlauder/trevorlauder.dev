import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogPageProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export interface BlogPath {
  params: { page: string };
  props: BlogPageProps;
}

const POSTS_PER_PAGE = 3;

/**
 * Normalize a label by converting kebab-case to Title Case
 */
export function normalizeLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Normalize a label to kebab-case slug format
 */
export function normalizeSlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Ensure all posts have valid pubDate, extracted from filename if needed
 */
export function enrichPostsWithDates(posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] {
  return posts.map((post) => {
    if (!post.data.pubDate) {
      const dateMatch = post.id.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        post.data.pubDate = new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
      }
    }
    return post;
  });
}

/**
 * Sort posts by publication date (newest first)
 */
export function sortPostsByDate(posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] {
  return posts.sort((a, b) => (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0));
}

export async function getBlogStaticPaths(): Promise<BlogPath[]> {
  const allPosts = sortPostsByDate(enrichPostsWithDates(await getCollection("blog"))).filter(
    (post) => post.data.pubDate
  );

  const paths: BlogPath[] = [];

  // Calculate total pages: 4 posts on page 1 (1 featured + 3 regular), then 3 posts per page for the rest
  const postsOnPage1 = Math.min(4, allPosts.length);
  const remainingPosts = allPosts.length - postsOnPage1;
  const totalPages = 1 + Math.ceil(remainingPosts / POSTS_PER_PAGE);

  // Page 1: 1 featured + 3 others = 4 total
  paths.push({
    params: { page: "1" },
    props: {
      posts: allPosts.slice(0, 4),
      currentPage: 1,
      totalPages: totalPages,
      totalPosts: allPosts.length,
    },
  });

  // Subsequent pages: 3 posts each
  const restPosts = allPosts.slice(postsOnPage1);
  const numPages = Math.ceil(restPosts.length / POSTS_PER_PAGE);

  for (let i = 0; i < numPages; i++) {
    paths.push({
      params: { page: String(i + 2) },
      props: {
        posts: restPosts.slice(i * POSTS_PER_PAGE, (i + 1) * POSTS_PER_PAGE),
        currentPage: i + 2,
        totalPages: totalPages,
        totalPosts: allPosts.length,
      },
    });
  }

  return paths;
}

export function getPostSlug(postId: string): string {
  const dateMatch = postId.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (dateMatch && dateMatch.length >= 5) {
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];
    const slug = (dateMatch[4] || "").toLowerCase();
    return `${year}/${month}/${day}/${slug}`;
  }
  return postId;
}
