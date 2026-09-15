import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
import RISeal from "../components/RISeal";
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

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-zinc-400">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link className="transition hover:text-[#F2D675]" href={href}>
        {children}
      </Link>
    </li>
  );
}

function FExt({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        className="transition hover:text-[#F2D675]"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    </li>
  );
}

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
            <div className="mb-10 max-w-xl">
              <Link
                href="/"
                className="inline-flex items-center transition hover:opacity-90"
                aria-label="Rasta Imperium home"
              >
                <RISeal size={32} showWordmark />
              </Link>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]/80">
                Identity · Witness · Verification
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Constitutional intelligence infrastructure. Deterministic governance,
                verifiable evidence, accountable autonomy.
              </p>
            </div>

            <div className="grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <FooterCol title="Understand">
                <FLink href="/">Rasta Imperium</FLink>
                <FLink href="/about-evo-v-kernel/">EVO-V</FLink>
                <FLink href="/why-deterministic-governance/">Why It Matters</FLink>
                <FLink href="/vision/">Vision</FLink>
              </FooterCol>

              <FooterCol title="Evidence">
                <FLink href="/observatory/">Observatory</FLink>
                <FLink href="/proof/">VERIFIED Capsules</FLink>
                <FLink href="/evidence/">Evidence Explorer</FLink>
                <FLink href="/trust/">Status Guide</FLink>
                <FLink href="/limitations/">Limitations</FLink>
              </FooterCol>

              <FooterCol title="Verify">
                <FLink href="/verify/">Verification Console</FLink>
                <FLink href="/evidence/export/">Capsule Export</FLink>
                <FExt href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md">
                  Reproduce Offline
                </FExt>
                <FLink href="/challenge/">Challenge Lab</FLink>
                <FLink href="/audit/">Auditor Handoff</FLink>
              </FooterCol>

              <FooterCol title="Architecture">
                <FLink href="/blueprint/">Nine-Layer Stack</FLink>
                <FLink href="/proof/">L7 — Identity + Trust</FLink>
                <FLink href="/architecture/">Architecture Split</FLink>
                <FLink href="/pillars/">Design Principles</FLink>
              </FooterCol>

              <FooterCol title="Codex">
                <FLink href="/codex/">RastafarAI Codex</FLink>
                <FLink href="/pillars/">Seven Articles</FLink>
                <FLink href="/governance/">Constitutional Principles</FLink>
              </FooterCol>

              <FooterCol title="About">
                <FLink href="/about/">Founder</FLink>
                <FLink href="/institutional-pilots/">Institutional Pilots</FLink>
                <FLink href="/evaluate/">Evaluate</FLink>
                <FLink href="/contact/">Contact</FLink>
                <FLink href="/explore/">Full atlas</FLink>
              </FooterCol>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-900 pt-6 text-sm text-zinc-500">
              <a
                className="transition hover:text-[#F2D675]"
                href="https://github.com/laszlomazsar-hash/rastaimperium"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span className="text-zinc-700" aria-hidden="true">
                ·
              </span>
              <a
                className="transition hover:text-[#F2D675]"
                href="https://substack.com/@laszlomazsar"
                target="_blank"
                rel="noreferrer"
              >
                Substack
              </a>
              <span className="text-zinc-700" aria-hidden="true">
                ·
              </span>
              <a
                className="transition hover:text-[#F2D675]"
                href="https://www.linkedin.com/in/laszlo-mazsar"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <span className="text-zinc-700" aria-hidden="true">
                ·
              </span>
              <a
                className="transition hover:text-[#F2D675]"
                href="https://x.com/laszlomazsar"
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
            </div>

            <div className="mt-6">
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
