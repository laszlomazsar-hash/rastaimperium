import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
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
  alternates: {
    canonical: "https://rastaimperium.com",
  },
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
        <footer className="royal-footer border-t border-[rgba(242,214,117,0.18)] bg-[#090a09] py-12 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {/* Brand */}
              <div className="max-w-sm sm:col-span-2 lg:col-span-1 xl:col-span-1">
                <Link
                  href="/"
                  className="font-cinzel text-lg tracking-[0.16em] text-[#D4AF37] transition hover:text-[#F2D675]"
                >
                  RASTA IMPERIUM
                </Link>
                <p className="mt-4 leading-6 text-zinc-400">
                  Constitutional intelligence infrastructure. Deterministic governance,
                  verifiable evidence, accountable autonomy.
                </p>
                <p className="mt-4">
                  <Link
                    href="/explore/"
                    className="text-sm text-[#F2D675] transition hover:underline"
                  >
                    Full atlas · Explore →
                  </Link>
                </p>
              </div>

              {/* Core journeys */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Core
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/">
                      Imperium
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/blueprint/">
                      System
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/codex/">
                      Codex
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/proof/">
                      Evidence
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/verify/">
                      Verify
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/audit/">
                      Audit
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Applications */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Applications
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/applications/">
                      Applications
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/case-studies/">
                      Case studies
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/product/">
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/observatory/">
                      Observatory
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Civilization */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Civilization
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/about/">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/empire/">
                      Empire
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/vision/">
                      Vision
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/pillars/">
                      Pillars
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/thanks-and-praise/">
                      Thanks &amp; Praise
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Knowledge + system docs */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Knowledge
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/library/">
                      Library
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/research/">
                      Research
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/architecture/">
                      Architecture
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/governance/">
                      Governance
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/systems/">
                      Systems
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/explore/">
                      Full atlas
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Institutional + technical */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Institutional
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/institutional-pilots/">
                      Consulting
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/contact/">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/limitations/">
                      Limitations
                    </Link>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-[#F2D675]"
                      href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pure Verifier
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-[#F2D675]"
                      href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Reproduce Offline
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-[#F2D675]"
                      href="https://github.com/laszlomazsar-hash/rastaimperium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-900 pt-6">
              <p className="text-xs leading-6 text-zinc-600">
                Rasta Imperium is the public constitutional and verification layer — not the EVO-V
                execution runtime. Unproven claims are labelled; see{" "}
                <Link href="/limitations/" className="text-zinc-500 underline hover:text-[#F2D675]">
                  Limitations
                </Link>
                . Wider public surfaces are indexed under{" "}
                <Link href="/explore/" className="text-zinc-500 underline hover:text-[#F2D675]">
                  Explore
                </Link>
                .
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
