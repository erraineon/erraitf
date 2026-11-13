import { defineHastPlugin } from "satteri";
import type { HastNode, PluginFactoryContext } from "satteri";

export function recipeIngredientsPlugin({ fileURL }: PluginFactoryContext) {
  if (!fileURL?.pathname.includes("/src/content/recipes/")) return false;

  return defineHastPlugin({
    name: "recipe-ingredients",
    after(root, context) {
      if (context.data.astro?.frontmatter.singleColumn) return;

      const { children } = root;
      const isHeading = (node: HastNode) =>
        node.type === "element" && node.tagName === "h2";
      const ingredients = children.findIndex(
        (node) =>
          isHeading(node) && context.textContent(node) === "Ingredients",
      );
      if (ingredients < 0) return;

      const next = children.findIndex(
        (node, index) => index > ingredients && isHeading(node),
      );
      if (next < 0) return;
      const afterNext = children.findIndex(
        (node, index) => index > next && isHeading(node),
      );
      const end = afterNext < 0 ? children.length : afterNext;
      const section = (start: number, stop: number) => ({
        type: "element" as const,
        tagName: "div",
        properties: {},
        children: children.slice(start, stop),
      });

      context.setProperty(root, "children", [
        ...children.slice(0, ingredients),
        {
          type: "element" as const,
          tagName: "div",
          properties: {
            // The last class is to prevent h2s from getting a margin, as if they were the first item in the div
            className: [
              "sm:grid",
              "sm:grid-cols-2",
              "sm:gap-4",
              "[&_ol,&_ul]:list-none",
              "[&_ol,&_ul]:ps-0",
              "[&_li]:ps-0",
              "[&_h2]:mt-0",
            ],
          },
          children: [section(ingredients, next), section(next, end)],
        },
        ...children.slice(end),
      ]);
    },
  });
}
