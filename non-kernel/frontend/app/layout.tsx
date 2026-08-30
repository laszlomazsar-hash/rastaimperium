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
        <header className="royal-header sticky top-0 z-50 border-b border-[#B8860B]/20 bg-[#080908]/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="royal-brand shrink-0 text-xs font-semibold tracking-[0.22em] text-[#D4AF37] transition hover:text-[#F2D675]">
              <span className="royal-brand-mark" aria-hidden="true">RI</span>
              <span>RASTA IMPERIUM</span>
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
        <footer className="royal-footer border-t border-[#B8860B]/20 bg-[#090a09] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 text-sm sm:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
              <div className="max-w-sm">
                <Link href="/" className="text-lg tracking-[0.18em] text-[#D4AF37] transition hover:text-[#F2D675]">THE RASTA IMPERIUM</Link>
                <p className="mt-4 leading-6 text-zinc-400">Sovereign AI architecture for constitutional intelligence, verifiable systems, and accountable autonomy.</p>
                <nav aria-label="Official social profiles" className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">Follow the work</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <a className="text-zinc-300 transition hover:text-[#F2D675]" href="https://www.linkedin.com/in/laszlo-mazsar-97744aa4?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a className="text-zinc-300 transition hover:text-[#F2D675]" href="https://www.facebook.com/share/1FuruSZYsy/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a>
                    <a className="text-zinc-300 transition hover:text-[#F2D675]" href="https://codexbylaszlo.substack.com" target="_blank" rel="noreferrer">Substack</a>
                    <a className="text-zinc-300 transition hover:text-[#F2D675]" href="https://github.com/laszlomazsar-hash" target="_blank" rel="noreferrer">GitHub</a>
                  </div>
                </nav>
              </div>

              <nav aria-label="Technology footer navigation">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">Technology</p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li><Link className="transition hover:text-[#F2D675]" href="/technology/evo-v">EVO-V architecture</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/technology">Rasta Kernel</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/systems/evo-g">EVO-G systems</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/architecture">ARK engine</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/governance">Governance</Link></li>
                </ul>
              </nav>

              <nav aria-label="Knowledge footer navigation">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">Knowledge</p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li><Link className="transition hover:text-[#F2D675]" href="/governance/codex">Rasta Codex</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/research">Research</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/library">Documentation</Link></li>
                  <li><Link className="transition hover:text-[#F2D675]" href="/contact">Engagement desk</Link></li>
                </ul>
              </nav>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8860B]">Publications & store</p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  <li><a className="transition hover:text-[#F2D675]" href="https://amzn.eu/d/0iNaEqMU" target="_blank" rel="noreferrer">Rasta Codex on Amazon</a></li>
                  <li><a className="transition hover:text-[#F2D675]" href="https://amzn.eu/d/0fi2uUre" target="_blank" rel="noreferrer">RastafarAI: EVO-V on Amazon</a></li>
                  <li><a className="transition hover:text-[#F2D675]" href="https://mazsar.gumroad.com/l/igggtj" target="_blank" rel="noreferrer">Daily Resonance</a></li>
                  <li><a className="transition hover:text-[#F2D675]" href="https://gumroad.com/products" target="_blank" rel="noreferrer">Online store</a></li>
                </ul>
              </div>
            </div>

            <details className="group mt-12 border-y border-[#B8860B]/20 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-zinc-200 marker:content-none">
                <span>EVO-V applications, command centres & public prototypes</span>
                <span aria-hidden="true" className="text-[#D4AF37] transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-5 grid gap-x-8 gap-y-3 text-sm text-zinc-400 sm:grid-cols-2 lg:grid-cols-3">
                <a className="transition hover:text-[#F2D675]" href="https://evo-veck.lovable.app" target="_blank" rel="noreferrer">EVO VECK applications</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-vcommacentre.lovable.app/?utm_id=97760_v0_s00_e0_tv4" target="_blank" rel="noreferrer">Adaptive Server Command Center</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-cosmos-core.lovable.app" target="_blank" rel="noreferrer">Kernel Console — 2,000 agents</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-vcloudcon.lovable.app" target="_blank" rel="noreferrer">EVO-V Cloud Control</a>
                <a className="transition hover:text-[#F2D675]" href="https://virtualpowerplant.lovable.app" target="_blank" rel="noreferrer">Virtual Power Plant</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-vision-launch.lovable.app" target="_blank" rel="noreferrer">EVO-V Investment App</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-vista-core.lovable.app" target="_blank" rel="noreferrer">EVO-V Vista — 100 governed agents</a>
                <a className="transition hover:text-[#F2D675]" href="https://evo-core-constitution.lovable.app" target="_blank" rel="noreferrer">Core Constitution</a>
                <a className="transition hover:text-[#F2D675]" href="https://github.com/laszlomazsar-hash/evo-v" target="_blank" rel="noreferrer">EVO-V open-source repository</a>
                <a className="transition hover:text-[#F2D675]" href="https://claude.ai/public/artifacts/f2602d8e-f749-455b-81ba-0f23d41f65de" target="_blank" rel="noreferrer">V5 Laplacian Shift</a>
                <a className="transition hover:text-[#F2D675]" href="https://claude.ai/public/artifacts/42917a65-12ec-4ec5-b1f5-f7a5a10704ce" target="_blank" rel="noreferrer">Cloudie</a>
              </div>
            </details>

            <div className="flex flex-col gap-3 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Rasta Imperium. All rights reserved.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link className="transition hover:text-zinc-200" href="/privacy">Privacy</Link>
                <Link className="transition hover:text-zinc-200" href="/terms">Terms</Link>
                <a className="transition hover:text-zinc-200" href="mailto:lazzlowtuning@me.com">lazzlowtuning@me.com</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
