"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RISeal from "./RISeal";

/**
 * Phase C — Constitutional technology navigation.
 * Labels map only to existing routes. No invented destinations.
 *
 * Visitor questions answered:
 * - What is this?     → Imperium · System · Codex
 * - Can I inspect it? → Evidence · Verify · Audit
 * - Can I engage?     → Consulting
 */
const primaryNav = [
  { href: "/", label: "Imperium" },
  { href: "/blueprint", label: "System" },
  { href: "/codex", label: "Codex" },
  { href: "/proof", label: "Evidence" },
  { href: "/verify", label: "Verify", emphasize: true },
  { href: "/audit", label: "Audit" },
  { href: "/institutional-pilots", label: "Consulting" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="royal-header sticky top-0 z-50 border-b border-[rgba(242,214,117,0.2)] bg-[#090a09]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="royal-brand shrink-0"
          onClick={() => setOpen(false)}
          aria-label="Rasta Imperium home"
        >
          <RISeal size={34} showWordmark />
        </Link>

        {/* Desktop primary */}
        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5 text-sm text-zinc-300">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              const emphasize = "emphasize" in item && item.emphasize;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      emphasize
                        ? `rounded-md px-2.5 py-2 font-semibold transition ${
                            active
                              ? "bg-[#D4AF37] text-black"
                              : "text-[#F2D675] hover:bg-[#B8860B]/15"
                          }`
                        : `rounded-md px-2.5 py-2 transition ${
                            active
                              ? "bg-[#B8860B]/15 text-[#F2D675]"
                              : "hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                          }`
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tablet condensed */}
        <nav aria-label="Primary tablet" className="hidden items-center md:flex lg:hidden">
          <ul className="flex items-center gap-0 text-xs text-zinc-300 sm:text-sm">
            {primaryNav
              .filter((i) =>
                ["/", "/proof", "/verify", "/audit", "/institutional-pilots"].includes(i.href)
              )
              .map((item) => {
                const active = isActive(pathname, item.href);
                const emphasize = "emphasize" in item && item.emphasize;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        emphasize
                          ? `rounded-md px-2 py-2 font-semibold transition ${
                              active
                                ? "bg-[#D4AF37] text-black"
                                : "text-[#F2D675] hover:bg-[#B8860B]/15"
                            }`
                          : `rounded-md px-2 py-2 transition ${
                              active
                                ? "bg-[#B8860B]/15 text-[#F2D675]"
                                : "hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                            }`
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/verify"
            className="rounded-md border border-[#B8860B]/50 px-2.5 py-1.5 text-xs font-semibold text-[#F2D675] transition hover:bg-[#B8860B]/15 md:hidden"
          >
            Verify
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-zinc-700 p-2.5 text-zinc-200 transition hover:border-[#B8860B]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2D675]"
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
        <div
          id="mobile-nav"
          className="border-t border-[rgba(242,214,117,0.15)] bg-[#0a0c0a] md:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
              Navigation
            </p>
            <ul className="space-y-1">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                const emphasize = "emphasize" in item && item.emphasize;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={
                        emphasize
                          ? `block rounded-lg px-4 py-3.5 text-base font-semibold transition ${
                              active
                                ? "bg-[#D4AF37] text-black"
                                : "bg-[#B8860B]/10 text-[#F2D675]"
                            }`
                          : `block rounded-lg px-4 py-3.5 text-base transition ${
                              active
                                ? "bg-[#B8860B]/15 text-[#F2D675]"
                                : "text-zinc-200 hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
                            }`
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 border-t border-zinc-800 pt-4">
              <Link
                href="/limitations"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm text-zinc-400 transition hover:text-[#F2D675]"
              >
                Limitations
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-lg px-4 py-3 text-sm text-zinc-400 transition hover:text-[#F2D675]"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
