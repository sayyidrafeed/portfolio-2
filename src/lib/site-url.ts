import { env } from "@/env";

export function getSiteURL() {
  return new URL(env.SITE_URL);
}
