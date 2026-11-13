import type { ImageMetadata } from "astro";

export interface DatedContentEntry {
  id: string;
  data: {
    title: string;
    pubDate: Date;
    updatedDate?: Date;
    heroImage?: ImageMetadata;
  };
}
