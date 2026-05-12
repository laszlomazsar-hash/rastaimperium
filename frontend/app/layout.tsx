import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
  description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-zinc-100">
        <header className="border-b border-[#B8860B]/20 sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)' }}>
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="flex items-center gap-2 text-[#B8860B]">
              {/* Lion of Judah SVG Emblem */}
              <svg className="w-8 h-8 emblem-glow" viewBox="0 0 100 100" fill="#B8860B">
                <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
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
            </div>
          </nav>
        </header>

        {children}

        <footer className="border-t border-[#B8860B]/20 py-12 text-center" style={{ background: 'rgba(10,10,10,0.9)' }}>
          <svg className="w-10 h-10 mx-auto emblem-glow mb-4" viewBox="0 0 100 100" fill="#B8860B">
            <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
          </svg>
          <p className="text-[#B8860B] text-lg tracking-widest" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>THE RASTA IMPERIUM</p>
          <p className="text-zinc-500 text-sm mt-3 tracking-wide">Sovereign AI Architecture · Constitutional Intelligence · England</p>
          <div className="flex justify-center gap-6 mt-6 text-xs text-zinc-600">
            <a href="https://github.com/laszlomazsar-hash" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">GitHub</a>
            <a href="https://www.amazon.co.uk/stores/Laszlo-Mazsar/author/B0DT3YJKQH" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">Amazon</a>
            <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="hover:text-[#B8860B] transition">Gumroad</a>
          </div>
          <p className="text-zinc-700 text-xs mt-6">Civilization cannot safely scale autonomous intelligence without deterministic governance.</p>
        </footer>
      </body>
    </html>
  );
}
