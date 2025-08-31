import { visit } from 'unist-util-visit'

export default function rehypeExternalIconify() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'a' &&
        node.properties?.href &&
        /^https?:\/\//.test(node.properties.href)
      ) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
        node.children.push({
          type: 'mdxJsxTextElement',
          name: 'Icon',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'name',
              value: 'fa7-solid:external-link',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'className',
              value: 'external-link',
            },
          ],
          children: [],
        });
      }
    })
  }
}
