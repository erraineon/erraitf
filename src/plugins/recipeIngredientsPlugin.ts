import { defineHastPlugin } from "satteri";
import type { HastNode, PluginFactoryContext } from "satteri";
import type { ElementContent } from "hast";

function findNextSectionEnd(children: HastNode[], start: number) {
  const next = children.findIndex(
    (node, index) =>
      index > start &&
      node.type === "element" &&
      (node.tagName === "h2" ||
        (node.tagName === "section" && node.properties.dataFootnotes === true)),
  );
  return next < 0 ? children.length : next;
}

function wrapSection(children: HastNode[], className?: string[]) {
  return {
    type: "element" as const,
    tagName: "div",
    properties: className ? { className } : {},
    children: children.filter(
      (node): node is ElementContent => node.type !== "doctype",
    ),
  };
}

export function recipeIngredientsPlugin({ fileURL }: PluginFactoryContext) {
  if (!fileURL?.pathname.includes("/src/content/recipes/")) return false;

  return defineHastPlugin({
    name: "recipe-ingredients",
    after(root, context) {
      const { children } = root;
      const isHeading = (node: HastNode) =>
        node.type === "element" && node.tagName === "h2";
      let updatedChildren = children;

      if (!context.data.astro?.frontmatter.singleColumn) {
        const ingredients = children.findIndex(
          (node) =>
            isHeading(node) && context.textContent(node) === "Ingredients",
        );
        if (ingredients >= 0) {
          const next = children.findIndex(
            (node, index) => index > ingredients && isHeading(node),
          );
          if (next >= 0) {
            const end = findNextSectionEnd(children, next);

            updatedChildren = [
              ...children.slice(0, ingredients),
              wrapSection(
                [
                  wrapSection(children.slice(ingredients, next)),
                  wrapSection(children.slice(next, end)),
                ],
                [
                  "sm:grid",
                  "sm:grid-cols-2",
                  "sm:gap-4",
                  "[&_ol,&_ul]:list-none",
                  "[&_ol,&_ul]:ps-0",
                  "[&_li]:ps-0",
                  "[&_h2]:mt-0",
                ],
              ),
              ...children.slice(end),
            ];
          }
        }
      }

      // Don't print links, they're pointless
      const links = updatedChildren.findIndex(
        (node) => isHeading(node) && context.textContent(node) === "Links",
      );
      if (links >= 0) {
        const end = findNextSectionEnd(updatedChildren, links);

        updatedChildren = [
          ...updatedChildren.slice(0, links),
          wrapSection(updatedChildren.slice(links, end), ["print:hidden"]),
          ...updatedChildren.slice(end),
        ];
      }

      context.setProperty(root, "children", updatedChildren);
    },
  });
}
