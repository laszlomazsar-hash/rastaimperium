import type { Metadata } from "next";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import "./globals.css";
import "./identity.css";

export const metadata: Metadata = {
  title: {
    default: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    template: "%s | Rasta Imperium",
  },
  description:
    "Deterministic AI governance for institutions: sealed evidence, design partner pilots, and auditable constitutional controls. Replayable. Auditable. Sovereign. Not opaque autonomy.",
  keywords: [
    "AI governance",
    "deterministic AI",
    "auditable AI",
    "constitutional AI",
    "deterministic governance",
    "sovereign AI",
    "EVO-V",
    "AI safety",
    "replay engine",
    "epistemic governance",
    "verification surface",
    "design partner pilot",
    "institutional AI",
    "trust console",
    "neurosymbolic",
  ],
  authors: [{ name: "Laszlo Mazsar" }],
  creator: "Rasta Imperium",
  metadataBase: new URL("https://rastaimperium.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://rastaimperium.com",
    siteName: "Rasta Imperium",
    title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    description:
      "Inspect sealed evidence. Run design partner pilots. Path to production runtime. Built for institutions that cannot afford opaque autonomy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rasta Imperium — Constitutional Intelligence Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    description:
      "Replayable. Auditable. Sovereign. Public verification surface and design partner pilots for constitutional AI governance.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://plausible.io/js/pa-gk0L-J_xecv-BrP67xDRE.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}</Script>
      </head>
      <body className="text-zinc-100">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
