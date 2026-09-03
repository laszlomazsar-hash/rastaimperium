import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    template: "%s | Rasta Imperium",
  },
  description:
    "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
  keywords: [
    "constitutional AI",
    "deterministic governance",
    "sovereign AI",
    "neurosymbolic",
    "EVO-V",
    "AI safety",
    "replay engine",
    "epistemic governance",
    "verification",
    "trust console",
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
      "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
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
    description: "Replayable. Auditable. Sovereign. Constitutional AI governance.",
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
        <header className="royal-header sticky top-0 z-50 border-b border-[#B8860B]/25 bg-[#090a09]/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.18em] text-[#D4AF37] transition hover:text-[#F2D675]"
            >
              RASTA IMPERIUM
            </Link>
            <nav aria-label="Primary" className="overflow-x-auto">
              <ul className="flex items-center gap-0.5 text-xs text-zinc-300 sm:text-sm">
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/product"
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/applications"
                  >
                    Apps
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/blueprint"
                  >
                    Blueprint
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/proof"
                  >
                    Proof
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/limitations"
                  >
                    Limitations
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/institutional-pilots"
                  >
                    Pilots
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3"
                    href="/about"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    className="block rounded-md border border-[#B8860B]/50 px-2.5 py-2 text-[#F2D675] transition hover:bg-[#B8860B] hover:text-black sm:px-3"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="royal-footer border-t border-[#B8860B]/20 bg-[#090a09] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 text-sm sm:grid-cols-2 xl:grid-cols-5">
              <div className="max-w-sm xl:col-span-1">
                <Link
                  href="/"
                  className="text-lg tracking-[0.18em] text-[#D4AF37] transition hover:text-[#F2D675]"
                >
                  THE RASTA IMPERIUM
                </Link>
                <p className="mt-4 leading-6 text-zinc-400">
                  Sovereign AI architecture for constitutional intelligence, verifiable systems, and
                  accountable autonomy.
                </p>
                <nav aria-label="Official social profiles" className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                    Follow the work
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <a
                      className="text-zinc-300 transition hover:text-[#F2D675]"
                      href="https://www.linkedin.com/in/laszlo-mazsar-97744aa4?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className="text-zinc-300 transition hover:text-[#F2D675]"
                      href="https://x.com/mazsarlaszlo"
                      target="_blank"
                      rel="noreferrer"
                    >
                      X
                    </a>
                    <a
                      className="text-zinc-300 transition hover:text-[#F2D675]"
                      href="https://github.com/laszlomazsar-hash"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </nav>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Explore
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/vision">
                      Vision
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/product">
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/applications">
                      Applications
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/blueprint">
                      Blueprint
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/pillars">
                      Pillars
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/architecture">
                      Architecture
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/technology">
                      Technology
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/codex">
                      Codex
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Verify
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/trust">
                      Trust Console
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/proof">
                      Proof Registry
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/evidence">
                      Evidence Explorer
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/challenge">
                      Challenge Lab
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/audit">
                      Auditor Handoff
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/limitations">
                      Limitations
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/governance-model">
                      Governance model
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Library
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/library">
                      Library
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/research">
                      Research
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/case-studies">
                      Case studies
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/pricing">
                      Pricing posture
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/about-evo-v-kernel">
                      EVO-V Kernel
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/thanks-and-praise">
                      Thanks & Praise
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/invest">
                      Invest
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  Engage
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/product">
                      Product pathway
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/institutional-pilots">
                      Design partner pilots
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/contact/?intent=design-partner">
                      Apply for pilot
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-[#F2D675]" href="/contact">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-[#F2D675]"
                      href="https://github.com/laszlomazsar-hash/rastaimperium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Repository
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-12 border-t border-zinc-900 pt-6 text-xs text-zinc-600">
              Rasta Imperium is the public constitutional and verification layer — not the EVO-V
              execution runtime. Unproven claims are labelled; see{" "}
              <Link href="/limitations/" className="text-zinc-500 underline hover:text-[#F2D675]">
                Limitations
              </Link>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
