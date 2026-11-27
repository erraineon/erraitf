import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      categories: z.record(z.string(), z.string()).optional(),
      isDraft: z.boolean().optional(),
    }),
});

const recipes = defineCollection({
  loader: glob({ base: "./src/content/recipes", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      categories: z.record(z.string(), z.string()).optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      isDraft: z.boolean().optional(),
      singleColumn: z.boolean().optional(),
      thinFirstColumn: z.boolean().optional(),
    }),
});

const categoryOption = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

const category = z.object({
  label: z.string(),
  options: z.array(categoryOption),
});

const sections = defineCollection({
  loader: glob({ base: "./src/content/sections", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // TODO: figure out to make this evaluated dynamically
    sourceCollection: z.enum(["blog", "recipes"]),
    showPostDate: z.boolean().default(true),
    mainCategory: z.string().optional(),
    categories: z.record(z.string(), category).default({}),
  }),
});

export const collections = { blog, recipes, sections };
