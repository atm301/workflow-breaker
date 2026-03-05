import type { MetadataRoute } from "next";
import { METHODS_DATA } from "@/lib/methods-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://workflow.atmarketing.tw";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/methods`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...METHODS_DATA.map((m) => ({
      url: `${baseUrl}/methods/${m.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
