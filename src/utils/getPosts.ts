export function getPosts() {
  const rawPosts = Object.values(
    import.meta.glob("../content/blog/*.mdx", { eager: true }),
  );

  return rawPosts
    .map((post: any) => {
      const fileName = post.file?.split("/").pop() || "";
      const [year, month, day, ...rest] = fileName.replace(".mdx", "").split("-");
      const rawTitle = rest.join("-");
      const date = new Date(`${year}-${month}-${day}`);
      return {
        ...post.frontmatter,
        slug: `blog/${year}/${month}/${day}/${rest.join("-").toLowerCase()}`,
        date,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
