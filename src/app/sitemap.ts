import type { MetadataRoute } from "next";

import { getSiteURL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: getSiteURL().toString(),
    },
  ];
}
