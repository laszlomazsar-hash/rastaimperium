import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasta Imperium",
  description: "The Rasta Imperium — A Sovereign Mythic-Technical Civilization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100 font-calibri">
        <header className="border-b border-gold/30 bg-black/95 sticky top-0 z-10 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap gap-4 text-sm">
            <Link href="/" className="font-georgia text-gold">Rasta Imperium</Link>
            <Link href="/empire">Empire</Link>
            <Link href="/pillars">Pillars</Link>
            <Link href="/library">Library</Link>
            <Link href="/intelligence">Intelligence</Link>
          </nav>
        </header>
        {children}
        <footer className="bg-black border-t border-gold/30 py-8 text-center text-gold text-sm">
          <div>@RastaLaszlo | Kettering, England | Architect Constitutional AI</div>
        </footer>
      </body>
    </html>
  );
}
