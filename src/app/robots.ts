import type { MetadataRoute } from "next";

import { getSiteURL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteURL = getSiteURL();

  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/studio/"],
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", siteURL).toString(),
  };
}
