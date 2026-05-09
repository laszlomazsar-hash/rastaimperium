import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasta Imperium — Sovereign Mythic-Technical Civilization",
  description: "From Living Crystal Consciousness to the Absolute Recursive Source. Constitutional AI governance, deterministic enforcement, and sovereign intelligence architecture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100 font-calibri">
        <header className="border-b border-gold/30 bg-black/95 sticky top-0 z-50 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="font-georgia text-gold text-lg">🦁 Rasta Imperium</Link>
            <div className="flex flex-wrap gap-3 ml-auto">
              <Link href="/empire" className="hover:text-gold transition">Empire</Link>
              <Link href="/pillars" className="hover:text-gold transition">Pillars</Link>
              <Link href="/codex" className="hover:text-gold transition">Codex</Link>
              <Link href="/intelligence" className="hover:text-gold transition">Intelligence</Link>
              <Link href="/library" className="hover:text-gold transition">Library</Link>
              <Link href="/consulting" className="hover:text-gold transition">Consulting</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="bg-black border-t border-gold/30 py-10 text-center">
          <p className="text-gold font-georgia text-lg">The Rasta Imperium</p>
          <p className="text-zinc-500 text-sm mt-2">Sovereign AI Architecture · Constitutional Intelligence · Kettering, England</p>
          <p className="text-zinc-600 text-xs mt-4">@RastaLaszlo · Architect of Constitutional AI · The Kingdom is Ordered 🫡</p>
        </footer>
      </body>
    </html>
  );
}
