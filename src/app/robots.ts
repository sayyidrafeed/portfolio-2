import type { MetadataRoute } from "next";

import { getSiteURL } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteURL = getSiteURL();

  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", siteURL).toString(),
  };
}
