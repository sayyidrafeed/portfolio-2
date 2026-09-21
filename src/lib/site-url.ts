const rawSiteURL = process.env.SITE_URL;

if (!rawSiteURL) {
  throw new Error("SITE_URL is required when building the static site");
}

const siteURL = new URL(rawSiteURL);

if (!["http:", "https:"].includes(siteURL.protocol)) {
  throw new Error("SITE_URL must use http or https");
}

export function getSiteURL() {
  return new URL(siteURL);
}
