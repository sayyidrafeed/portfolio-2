import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import type { Metadata } from "next";

import { importMap } from "../importMap.js";

type StudioPageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: StudioPageProps): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function StudioPage({ params, searchParams }: StudioPageProps) {
  return RootPage({ config, importMap, params, searchParams });
}
