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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://rastaimperium.com",
    siteName: "Rasta Imperium",
    title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rasta Imperium — Constitutional Intelligence Infrastructure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    description: "Replayable. Auditable. Sovereign. Constitutional AI governance.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon.png", type: "image/png", sizes: "192x192" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Plausible Analytics — privacy-friendly, no cookies */}
        <Script async src="https://plausible.io/js/pa-gk0L-J_xecv-BrP67xDRE.js" strategy="afterInteractive" />
        <Script id="plausible-init" strategy="afterInteractive">{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}</Script>
      </head>
      <body className="text-zinc-100">
        <header className="border-b border-[#B8860B]/20 sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)' }}>
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="flex items-center gap-2 text-[#B8860B]">
              <svg className="w-8 h-8 emblem-glow" viewBox="0 0 100 100" fill="#B8860B">
                <path d="M50 5 C55 5 60 8 62 12 C65 8 70 6 75 8 C80 10 82 15 80 20 C85 18 90 20 92 25 C94 30 92 35 88 38 C92 42 93 48 90 52 C87 56 83 58 80 58 C82 62 82 67 80 72 C78 77 74 80 70 80 C70 84 68 88 65 90 C62 92 58 93 55 92 C55 95 53 97 50 98 C47 97 45 95 45 92 C42 93 38 92 35 90 C32 88 30 84 30 80 C26 80 22 77 20 72 C18 67 18 62 20 58 C17 58 13 56 10 52 C7 48 8 42 12 38 C8 35 6 30 8 25 C10 20 15 18 20 20 C18 15 20 10 25 8 C30 6 35 8 38 12 C40 8 45 5 50 5Z" />
                <text x="50" y="62" textAnchor="middle" fill="#0a0a0a" fontSize="32" fontWeight="bold" fontFamily="serif">L</text>
              </svg>
              <span className="text-lg tracking-widest" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>RASTAIMPERIUM</span>
            </Link>
            <div className="flex flex-wrap gap-4 ml-auto tracking-wide">
              <Link href="/empire" className="hover:text-[#B8860B] transition">Empire</Link>
              <Link href="/pillars" className="hover:text-[#B8860B] transition">Pillars</Link>
              <Link href="/codex" className="hover:text-[#B8860B] transition">Codex</Link>
              <Link href="/intelligence" className="hover:text-[#B8860B] transition">Intelligence</Link>
              <Link href="/library" className="hover:text-[#B8860B] transition">Library</Link>
              <Link href="/witness" className="hover:text-[#B8860B] transition">Witness</Link>
              <Link href="/consulting" className="hover:text-[#B8860B] transition">Consulting</Link>
              <Link href="/applications" className="hover:text-[#B8860B] transition">Applications</Link>
              <Link href="/invest" className="hover:text-[#B8860B] transition font-bold text-green-400">Invest</Link>
            </div>
          </nav>
        </header>

        {children}

        {/* FOOTER with email capture */}
        <footer className="border-t border-[#B8860B]/20 py-12" style={{ background: 'rgba(10,10,10,0.9)' }}>
          <div className="mx-auto max-w-6xl px-4">
            {/* Email Capture — Buttondown */}
            <div className="text-center mb-10">
              <p className="text-[#B8860B] text-sm tracking-widest mb-3" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>JOIN THE FREQUENCY</p>
              <p className="text-zinc-400 text-sm mb-4">Receive constitutional intelligence dispatches. No spam. Sovereign signal only.</p>
              <form action="https://buttondown.com/api/emails/embed-subscribe/rastaimperium" method="post" target="popupwindow" className="flex justify-center gap-2 max-w-md mx-auto">
                <input type="email" name="email" placeholder="your@email.com" required className="flex-1 rounded-md border border-[#B8860B]/40 bg-black/80 px-4 py-2 text-zinc-100 text-sm placeholder:text-zinc-600" />
                <button type="submit" className="rounded-md bg-[#B8860B] text-black px-5 py-2 text-sm font-bold hover:bg-yellow-700 transition">Subscribe</button>
              </form>
            </div>

            <div className="text-center">
              <svg className="w-10 h-10 mx-auto emblem-glow mb-4" viewBox="0 0 100 100" fill="#B8860B">
                <path d="M50 5 C55 5 60 8 62 12 C65 8 70 6 75 8 C80 10 82 15 80 20 C85 18 90 20 92 25 C94 30 92 35 88 38 C92 42 93 48 90 52 C87 56 83 58 80 58 C82 62 82 67 80 72 C78 77 74 80 70 80 C70 84 68 88 65 90 C62 92 58 93 55 92 C55 95 53 97 50 98 C47 97 45 95 45 92 C42 93 38 92 35 90 C32 88 30 84 30 80 C26 80 22 77 20 72 C18 67 18 62 20 58 C17 58 13 56 10 52 C7 48 8 42 12 38 C8 35 6 30 8 25 C10 20 15 18 20 20 C18 15 20 10 25 8 C30 6 35 8 38 12 C40 8 45 5 50 5Z" />
                <text x="50" y="62" textAnchor="middle" fill="#0a0a0a" fontSize="32" fontWeight="bold" fontFamily="serif">L</text>
              </svg>
              <p className="text-[#B8860B] text-lg tracking-widest" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>THE RASTA IMPERIUM</p>
              <p className="text-zinc-500 text-sm mt-3 tracking-wide">Sovereign AI Architecture · Constitutional Intelligence · England</p>
              <div className="flex justify-center gap-6 mt-6 text-xs text-zinc-600">
                <a href="https://github.com/laszlomazsar-hash" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">GitHub</a>
                <a href="https://www.amazon.co.uk/stores/Laszlo-Mazsar/author/B0DT3YJKQH" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">Amazon</a>
                <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">Gumroad</a>
                <a href="https://www.linkedin.com/in/laszlomazsar" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">LinkedIn</a>
              </div>
              <p className="text-zinc-700 text-xs mt-6">Civilization cannot safely scale autonomous intelligence without deterministic governance.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
