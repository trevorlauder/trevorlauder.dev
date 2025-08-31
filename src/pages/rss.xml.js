import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => {
			const [year, month, day, ...rest] = post.id.split('-');
			const titleSlug = rest.join('-').toLowerCase();
			const slug = `blog//${year}/${month}/${day}/${titleSlug}/`;
			return {
				...post.data,
				link: slug,
			};
		}),
	});
}
