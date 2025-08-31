import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),
			indexImage: z.string().optional(),
			ogImage: z.string().optional(),
			categories: z.array(z.string()),
		}),
});

export const collections = { blog };
