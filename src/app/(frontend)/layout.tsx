import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { getSiteURL } from "@/lib/site-url";

import { profile } from "./content";
import "./globals.css";
import { INTRO_GATE_SCRIPT } from "./intro-gate";

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
      <body>
        <Script id="intro-gate" strategy="beforeInteractive">
          {INTRO_GATE_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
