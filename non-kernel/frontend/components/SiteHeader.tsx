"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Full primary set — desktop (lg+) */
const desktopPrimary = [
  { href: "/product", label: "Product" },
  { href: "/applications", label: "Apps" },
  { href: "/observatory", label: "Observatory" },
  { href: "/blueprint", label: "Blueprint" },
  { href: "/proof", label: "Proof" },
  { href: "/institutional-pilots", label: "Pilots" },
];

/** Condensed primary — tablet (md–lg) */
const tabletPrimary = [
  { href: "/product", label: "Product" },
  { href: "/applications", label: "Apps" },
  { href: "/proof", label: "Proof" },
  { href: "/institutional-pilots", label: "Pilots" },
];

const moreLinks = [
  { href: "/observatory", label: "Observatory" },
  { href: "/blueprint", label: "Blueprint" },
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

/** Tablet More omits links already on tablet bar */
const tabletMoreLinks = moreLinks;

const mobilePrimary = desktopPrimary;

function MoreMenu({
  open,
  setOpen,
  links,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  links: { href: string; label: string }[];
}) {
  return (
    <li className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 180);
        }}
        className="flex items-center gap-1 rounded-md px-2 py-2 text-xs transition hover:bg-[#B8860B]/10 hover:text-[#F2D675] md:px-2.5 md:text-sm"
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
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-[70vh] min-w-[13rem] overflow-y-auto rounded-lg border border-[#B8860B]/30 bg-[#0c0e0c] py-2 shadow-2xl shadow-black/50">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
              onClick={() => setOpen(false)}
            >
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

  // Close drawer when resizing into desktop/tablet inline nav
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="royal-header sticky top-0 z-50 border-b border-[#B8860B]/25 bg-[#090a09]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6 sm:py-3 md:gap-3 lg:px-8">
        <Link href="/" className="royal-brand shrink-0" onClick={() => setOpen(false)}>
          <span className="royal-brand-mark" aria-hidden="true">
            RI
          </span>
          <span className="hidden text-sm font-semibold tracking-[0.16em] text-[#D4AF37] transition hover:text-[#F2D675] xs:inline sm:inline">
            RASTA IMPERIUM
          </span>
          <span className="text-sm font-semibold tracking-[0.14em] text-[#D4AF37] sm:hidden">
            RASTA
          </span>
        </Link>

        {/* Tablet nav — md to lg */}
        <nav aria-label="Primary tablet" className="hidden items-center md:flex lg:hidden">
          <ul className="flex items-center gap-0 text-xs text-zinc-300 sm:text-sm">
            {tabletPrimary.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-2 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <MoreMenu open={moreOpen} setOpen={setMoreOpen} links={tabletMoreLinks} />
            <li>
              <Link
                href="/contact"
                className="ml-0.5 block rounded-md border border-[#B8860B]/50 px-2.5 py-1.5 text-[#F2D675] transition hover:bg-[#B8860B] hover:text-black"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop nav — lg+ */}
        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5 text-sm text-zinc-300">
            {desktopPrimary.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-md px-2.5 py-2 transition hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <MoreMenu
              open={moreOpen}
              setOpen={setMoreOpen}
              links={[
                { href: "/technology", label: "Technology" },
                { href: "/codex", label: "Codex" },
                { href: "/pricing", label: "Pricing" },
                { href: "/limitations", label: "Limitations" },
                { href: "/library", label: "Library" },
                { href: "/research", label: "Research" },
                { href: "/about", label: "About" },
                { href: "/thanks-and-praise", label: "Thanks & Praise" },
                { href: "/invest", label: "Invest" },
              ]}
            />
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

        {/* Phone toggle — below md */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/contact"
            className="rounded-md border border-[#B8860B]/40 px-2.5 py-1.5 text-xs font-semibold text-[#F2D675]"
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

      {/* Phone drawer — below md only */}
      {open && (
        <div className="border-t border-[#B8860B]/20 bg-[#0a0c0a] md:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
              Primary
            </p>
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {mobilePrimary.map((l) => (
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
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {moreLinks
                .filter((l) => !mobilePrimary.some((p) => p.href === l.href))
                .map((l) => (
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
