import { getCollection } from "astro:content";
let nsfwCache: Map<string, boolean> | null = null;

export async function isNsfwRoute(href: string): Promise<boolean> {
  if (!nsfwCache) {
    const allEntries = await getCollection("blog");
    nsfwCache = new Map(
      allEntries.map((entry) => [entry.id, entry.data.isNsfw === true]),
    );
  }

  const cleanHref = href.replace(/^\//, "").replace(/\/$/, "");
  return nsfwCache.get(cleanHref) ?? false;
}
