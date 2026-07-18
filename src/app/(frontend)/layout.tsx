import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSiteURL } from "@/lib/site-url";

type FrontendLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: getSiteURL(),
  description: "A design-neutral foundation for a personal portfolio.",
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
};

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
