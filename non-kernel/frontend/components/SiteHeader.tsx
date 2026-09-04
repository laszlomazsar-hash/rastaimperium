"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const primaryLinks = [
  { href: "/product", label: "Product" },
  { href: "/applications", label: "Apps" },
  { href: "/observatory", label: "Observatory" },
  { href: "/blueprint", label: "Blueprint" },
  { href: "/proof", label: "Proof" },
  { href: "/institutional-pilots", label: "Pilots" },
];

const moreLinks = [
  { href: "/technology", label: "Technology" },
  { href: "/codex", label: "Codex" },
  { href: "/pricing", label: "Pricing" },
  { href: "/limitations", label: "Limitations" },
  { href: "/library", label: "Library" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/thanks-and-praise", label: "Thanks & Praise" },
  { href: "/invest", label: "Invest" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="royal-header sticky top-0 z-50 border-b border-[#B8860B]/25 bg-[#090a09]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="royal-brand shrink-0" onClick={() => setOpen(false)}>
          <span className="royal-brand-mark" aria-hidden="true">
            RI
          </span>
          <span className="text-sm font-semibold tracking-[0.16em] text-[#D4AF37] transition hover:text-[#F2D675]">
            RASTA IMPERIUM
          </span>
        </Link>

        {/* Desktop */}
        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5 text-sm text-zinc-300">
            {primaryLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((v) => !v)}
                onBlur={() => {
                  // delay so click on menu item registers
                  window.setTimeout(() => setMoreOpen(false), 150);
                }}
                className="flex items-center gap-1 rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
              >
                More
                <svg className="h-3.5 w-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[12rem] rounded-lg border border-[#B8860B]/30 bg-[#0c0e0c] py-2 shadow-2xl shadow-black/50">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                      onClick={() => setMoreOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link
                href="/contact"
                className="ml-1 block rounded-md border border-[#B8860B]/50 px-3 py-2 text-[#F2D675] transition hover:bg-[#B8860B] hover:text-black"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/contact"
            className="rounded-md border border-[#B8860B]/40 px-3 py-1.5 text-xs font-semibold text-[#F2D675]"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-zinc-700 p-2 text-zinc-200 transition hover:border-[#B8860B]/50"
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-[#B8860B]/20 bg-[#0a0c0a] lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
              Primary
            </p>
            <ul className="grid grid-cols-2 gap-1">
              {primaryLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
              More
            </p>
            <ul className="grid grid-cols-2 gap-1">
              {moreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contact/?intent=design-partner"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-lg bg-[#D4AF37] px-4 py-3 text-center text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
