import type { MetadataRoute } from "next";

import { getSiteURL } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: getSiteURL().toString(),
    },
  ];
}
