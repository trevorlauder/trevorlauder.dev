import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Node } from "unist";

interface ElementNode extends Node {
  tagName: string;
  properties?: {
    href?: string;
    target?: string;
    rel?: string;
  };
  children: Array<Record<string, unknown>>;
}

const rehypeExternalIconify: Plugin = () => {
  return (tree: unknown) => {
    visit(tree as Node, "element", (node: ElementNode) => {
      if (
        node.tagName === "a" &&
        node.properties?.href &&
        typeof node.properties.href === "string" &&
        /^https?:\/\//.test(node.properties.href)
      ) {
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";

        node.children.push({
          type: "mdxJsxTextElement",
          name: "Icon",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "name",
              value: "fa7-solid:external-link",
            },
            {
              type: "mdxJsxAttribute",
              name: "class",
              value: "w-3.5 h-3.5 ml-1 inline-block align-middle",
            },
          ],
          children: [],
        });
      }
    });
  };
};

export default rehypeExternalIconify;
