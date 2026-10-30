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

const siteTitle = `${profile.name} - ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: getSiteURL(),
  alternates: { canonical: "/" },
  description: profile.intro,
  openGraph: {
    description: profile.intro,
    locale: "en_US",
    siteName: profile.name,
    title: siteTitle,
    type: "profile",
    url: "/",
  },
  title: {
    default: siteTitle,
    template: `%s · ${profile.name}`,
  },
  twitter: {
    card: "summary_large_image",
    description: profile.intro,
    title: siteTitle,
  },
};

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  return (
    // The intro gate script sets data-intro on <html> before hydration.
    <html className={`${sans.variable} ${mono.variable}`} lang="en" suppressHydrationWarning>
      <body>
        <Script id="intro-gate" strategy="beforeInteractive">
          {INTRO_GATE_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
