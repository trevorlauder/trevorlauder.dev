import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkGfm from "remark-gfm";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import externalIconify from "./plugins/external-iconify.js";

export default defineConfig({
  site: "https://trevorlauder.dev",

  integrations: [
    expressiveCode({
      themes: ["dracula"],
    }),
    mdx(),
    sitemap(),
    icon(),
  ],
  image: {
    responsiveStyles: true,
    layout: "constrained",
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        widths: [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
        quality: 70,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [externalIconify],
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [externalIconify],
  },
});
