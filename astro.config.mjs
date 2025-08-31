import mdx from '@astrojs/mdx';
import remarkGfm from "remark-gfm";
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalIconify from './plugins/rehype-external-iconify.js'

import icon from 'astro-icon';

import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://trevorlauder.dev',
  integrations: [
    expressiveCode({
      themes: ['dracula'],
    }),
    mdx(),
    sitemap(),
    preact(),
    icon()
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [rehypeExternalIconify],
  },
  mdx: {
    remarkPlugins: [remarkGfm],
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained',
    service: {
      config: {
        widths: [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
        quality: 70,
      }
    }
  },
});
