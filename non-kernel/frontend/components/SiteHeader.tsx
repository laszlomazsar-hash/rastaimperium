"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RISeal from "./RISeal";

const desktopPrimary = [
  { href: "/product", label: "Product" },
  { href: "/applications", label: "Apps" },
  { href: "/observatory", label: "Observatory" },
  { href: "/blueprint", label: "Blueprint" },
  { href: "/proof", label: "Proof" },
  { href: "/institutional-pilots", label: "Pilots" },
];

const moreLinks = [
  { href: "/why-deterministic-governance", label: "Why Deterministic" },
  { href: "/governance-model", label: "Governance model" },
  { href: "/architecture", label: "Architecture" },
  { href: "/technology", label: "Technology" },
  { href: "/evidence", label: "Evidence" },
  { href: "/limitations", label: "Limitations" },
  { href: "/codex", label: "Codex" },
  { href: "/library", label: "Library" },
  { href: "/design-system", label: "Design System" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/thanks-and-praise", label: "Thanks & Praise" },
  { href: "/invest", label: "Invest" },
];

function MoreMenu({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <li className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onBlur={() => window.setTimeout(() => setOpen(false), 180)}
        className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
      >
        More <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-[70vh] min-w-[14rem] overflow-y-auto rounded-lg border border-[#B8860B]/30 bg-[#0c0e0c] py-2 shadow-2xl shadow-black/50">
          {moreLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="royal-header sticky top-0 z-50 border-b border-[#B8860B]/25 bg-[#090a09]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center" onClick={() => setOpen(false)} aria-label="Rasta Imperium home">
          <RISeal size={34} showWordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5">
            {desktopPrimary.map((l) => (
              <li key={l.href}><Link href={l.href} className="block rounded-md px-2.5 py-2 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]">{l.label}</Link></li>
            ))}
            <MoreMenu open={moreOpen} setOpen={setMoreOpen} />
            <li><Link href="/contact" className="ml-1 block rounded-md border border-[#B8860B]/50 px-3 py-2 text-sm text-[#F2D675] transition hover:bg-[#B8860B] hover:text-black">Contact</Link></li>
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <Link href="/proof" className="rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:text-[#F2D675]">Proof</Link>
          <Link href="/blueprint" className="rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:text-[#F2D675]">Blueprint</Link>
          <MoreMenu open={moreOpen} setOpen={setMoreOpen} />
          <Link href="/contact" className="rounded-md border border-[#B8860B]/50 px-2.5 py-1.5 text-sm text-[#F2D675] hover:bg-[#B8860B] hover:text-black">Contact</Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/verify" className="rounded-md border border-[#B8860B]/40 px-2.5 py-1.5 text-xs font-semibold text-[#F2D675]">Verify</Link>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="rounded-md border border-zinc-700 p-2 text-zinc-200 transition hover:border-[#B8860B]/50">
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#B8860B]/20 bg-[#0a0c0a] md:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">Explore</p>
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {[...desktopPrimary, ...moreLinks].map((l) => (
                <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]">{l.label}</Link></li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/verify" onClick={() => setOpen(false)} className="rounded-lg border border-[#B8860B]/40 px-4 py-3 text-center text-sm font-semibold text-[#F2D675]">Verify evidence</Link>
              <Link href="/contact/?intent=design-partner" onClick={() => setOpen(false)} className="rounded-lg bg-[#D4AF37] px-4 py-3 text-center text-sm font-bold text-black">Apply · design partner</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
