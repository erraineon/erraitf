import type { RootContent, Root } from "mdast";
import { defineMdastPlugin } from "satteri";
import type {
  Custom,
  MdastNode,
  MdastVisitorContext,
  PluginFactoryContext,
} from "satteri";

function div(children: (MdastNode | Custom)[], className?: string[]): Custom {
  return {
    type: "section",
    data: {
      hName: "div",
      hProperties: className ? { className } : {},
    },
    children,
  };
}

function isH2(node: MdastNode) {
  return node.type === "heading" && node.depth === 2;
}

export function recipesPlugin({ fileURL }: PluginFactoryContext) {
  if (!fileURL?.pathname.includes("/src/content/recipes/")) return false;

  return defineMdastPlugin({
    name: "recipes",
    after(root, context) {
      const children = root.children;
      if (context.data.astro?.frontmatter?.singleColumn !== true) {
        sectionIngredientsTwoColumns(children, context, root);
      }

      hideLinksInPrinting(children, context);
    },
  });
}
function hideLinksInPrinting(
  children: RootContent[],
  context: MdastVisitorContext,
) {
  const linksIndex = children.findIndex(
    (node) => isH2(node) && context.textContent(node) === "Links",
  );
  if (linksIndex >= 0) {
    const endIndex = children.findIndex(
      (node, index) => index > linksIndex && isH2(node),
    );
    const flushIndex = endIndex < 0 ? children.length : endIndex;
    for (const node of children.slice(linksIndex, flushIndex)) {
      context.setProperty(node, "data", {
        hProperties: { className: ["print:hidden"] },
      });
    }
  }
}

function sectionIngredientsTwoColumns(
  children: RootContent[],
  context: MdastVisitorContext,
  root: Readonly<Root>,
) {
  const ingredientsHeaderIndex = children.findIndex(
    (x) => isH2(x) && context.textContent(x) === "Ingredients",
  );
  const nextSectionIndex = children.findIndex(
    (x, i) => i > ingredientsHeaderIndex && isH2(x),
  );
  if (
    ingredientsHeaderIndex >= 0 &&
    nextSectionIndex > ingredientsHeaderIndex
  ) {
    const endIndex = children.findIndex(
      (x, i) =>
        i > nextSectionIndex &&
        // Avoid footnotes from getting lumped on the right column.
        (isH2(x) || x.type === "footnoteReference"),
    );
    const flushIndex = endIndex < 0 ? children.length : endIndex;

    context.setField(root, "children", [
      ...children.slice(0, ingredientsHeaderIndex),
      div(
        [
          div(children.slice(ingredientsHeaderIndex, nextSectionIndex)),
          div(children.slice(nextSectionIndex, flushIndex)),
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
      ...children.slice(flushIndex),
    ]);
  }
}
