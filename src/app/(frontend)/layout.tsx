import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { getSiteURL } from "@/lib/site-url";

import { profile } from "./content";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400"] });

type FrontendLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: getSiteURL(),
  description: profile.intro,
  title: {
    default: profile.name,
    template: `%s · ${profile.name}`,
  },
};

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  return (
    <html className={`${sans.variable} ${mono.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
