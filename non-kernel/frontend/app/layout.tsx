import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import SiteHeader from "../components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    template: "%s | Rasta Imperium",
  },
  description:
    "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
  authors: [{ name: "Laszlo Mazsar" }],
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
  creator: "Rasta Imperium",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://rastaimperium.com/",
    siteName: "Rasta Imperium",
    title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    description:
      "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
    images: [
      {
        url: "https://rastaimperium.com/og-image.png",
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
    images: ["https://rastaimperium.com/og-image.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://rastaimperium.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://plausible.io/js/pa-gk0L-J_xecv-BrP67xDRE.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </head>
      <body className="text-zinc-100">
        <SiteHeader />
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
                    <a
                      className="text-zinc-300 transition hover:text-[#F2D675]"
                      href="https://substack.com/@codexbylaszlo"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Substack
                    </a>
                  </div>
                </nav>
              </div>
              {/* remaining footer columns preserved via full file - see note */}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
