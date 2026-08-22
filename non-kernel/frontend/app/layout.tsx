import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    template: "%s | Rasta Imperium",
  },
  description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
  keywords: ["constitutional AI", "deterministic governance", "sovereign AI", "neurosymbolic", "EVO-V", "AI safety", "replay engine", "epistemic governance"],
  authors: [{ name: "Laszlo Mazsar" }],
  creator: "Rasta Imperium",
  metadataBase: new URL("https://rastaimperium.com"),
  openGraph: { type: "website", locale: "en_GB", url: "https://rastaimperium.com", siteName: "Rasta Imperium", title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI", description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rasta Imperium — Constitutional Intelligence Infrastructure" }] },
  twitter: { card: "summary_large_image", title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI", description: "Replayable. Auditable. Sovereign. Constitutional AI governance.", images: ["/og-image.png"] },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon.png", type: "image/png", sizes: "192x192" }] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://plausible.io/js/pa-gk0L-J_xecv-BrP67xDRE.js" strategy="afterInteractive" />
        <Script id="plausible-init" strategy="afterInteractive">{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}</Script>
      </head>
      <body className="text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-[#B8860B]/20 bg-[#080908]/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="shrink-0 text-xs font-semibold tracking-[0.22em] text-[#D4AF37] transition hover:text-[#F2D675]">
              RASTA IMPERIUM
            </Link>
            <nav aria-label="Primary navigation" className="min-w-0 flex-1 overflow-x-auto">
              <ul className="flex min-w-max items-center justify-end gap-1 text-xs font-medium text-zinc-300 sm:gap-2">
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/vision">Vision</Link></li>
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/technology">Technology</Link></li>
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/systems">Systems</Link></li>
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/governance">Governance</Link></li>
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/research">Research</Link></li>
                <li><Link className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] sm:px-3" href="/lab">Lab</Link></li>
                <li><Link className="block rounded-md border border-[#B8860B]/50 px-2.5 py-2 text-[#F2D675] transition hover:bg-[#B8860B] hover:text-black sm:px-3" href="/contact">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-[#B8860B]/20 py-12" style={{ background: 'rgba(10,10,10,0.9)' }}>
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[#B8860B] text-lg tracking-widest">THE RASTA IMPERIUM</p>
                <p className="text-zinc-500 text-sm mt-3 tracking-wide">Sovereign AI Architecture · Constitutional Intelligence · England</p>
              </div>
              <nav aria-label="Technology footer navigation">
                <p className="text-[#B8860B] text-xs uppercase tracking-[0.24em]">Technology</p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li><Link className="hover:text-[#B8860B] transition" href="/technology/evo-v">EVO-V</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/systems/evo-g">EVO-G</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/architecture">ARK Engine</Link></li>
                </ul>
              </nav>
              <nav aria-label="Knowledge footer navigation">
                <p className="text-[#B8860B] text-xs uppercase tracking-[0.24em]">Knowledge</p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li><Link className="hover:text-[#B8860B] transition" href="/governance/codex">Codex</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/research">Research</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/library">Documentation</Link></li>
                </ul>
              </nav>
              <nav aria-label="Company footer navigation">
                <p className="text-[#B8860B] text-xs uppercase tracking-[0.24em]">Company</p>
                <ul className="mt-4 space-y-2 text-zinc-400">
                  <li><Link className="hover:text-[#B8860B] transition" href="/vision">Vision</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/contact">Contact</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/privacy">Privacy</Link></li>
                  <li><Link className="hover:text-[#B8860B] transition" href="/terms">Terms</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
