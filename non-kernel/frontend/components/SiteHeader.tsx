"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import RISeal from "./RISeal";

/** Hierarchical institutional navigation — UNDERSTAND / SYSTEM / PROOF / ENGAGE */

type NavItem = { href: string; label: string; emphasize?: boolean };
type NavGroup = { id: string; label: string; items: NavItem[]; tone?: "proof" | "engage" | "default" };

const navGroups: NavGroup[] = [
  {
    id: "understand",
    label: "Understand",
    items: [
      { href: "/", label: "Imperium" },
      { href: "/about", label: "About" },
      { href: "/vision", label: "Vision" },
      { href: "/pillars", label: "Pillars" },
      { href: "/codex", label: "Codex" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { href: "/architecture", label: "Architecture" },
      { href: "/blueprint", label: "Blueprint" },
      { href: "/technology", label: "Technology" },
      { href: "/governance", label: "Governance" },
      { href: "/research", label: "Research" },
    ],
  },
  {
    id: "proof",
    label: "Proof",
    tone: "proof",
    items: [
      { href: "/observatory", label: "Observatory" },
      { href: "/proof", label: "Proof Registry" },
      { href: "/evidence", label: "Evidence" },
      { href: "/verify", label: "Verify", emphasize: true },
      { href: "/challenge", label: "Challenge" },
      { href: "/evaluate", label: "Evaluate" },
      { href: "/limitations", label: "Limitations" },
      { href: "/audit", label: "Audit" },
    ],
  },
  {
    id: "engage",
    label: "Engage",
    tone: "engage",
    items: [
      { href: "/product", label: "Product" },
      { href: "/institutional-pilots", label: "Institutional Pilots" },
      { href: "/investment", label: "Investment" },
      { href: "/consulting", label: "Consulting" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const desktopTop: NavItem[] = [
  { href: "/", label: "Imperium" },
  { href: "/blueprint", label: "System" },
  { href: "/observatory", label: "Proof" },
  { href: "/verify", label: "Verify", emphasize: true },
  { href: "/evaluate", label: "Evaluate" },
  { href: "/institutional-pilots", label: "Engage" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActive(pathname: string, group: NavGroup) {
  return group.items.some((i) => isActive(pathname, i.href));
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const menuId = useId();

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
    setDesktopOpen(null);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, boolean> = {};
    for (const g of navGroups) {
      next[g.id] = groupHasActive(pathname, g) || g.id === "proof";
    }
    setExpanded(next);
  }, [open, pathname]);

  const linkClass = (active: boolean, emphasize?: boolean) =>
    emphasize
      ? `block rounded-md px-3 py-2.5 text-sm font-semibold transition ${
          active ? "bg-[#D4AF37] text-black" : "text-[#F2D675] hover:bg-[#B8860B]/15"
        }`
      : `block rounded-md px-3 py-2.5 text-sm transition ${
          active
            ? "bg-[#B8860B]/15 text-[#F2D675]"
            : "text-zinc-300 hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
        }`;

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

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5 text-sm text-zinc-300">
            {desktopTop.map((item) => {
              const active = isActive(pathname, item.href);
              const panelId =
                item.label === "System"
                  ? "system"
                  : item.label === "Proof"
                    ? "proof"
                    : item.label === "Engage"
                      ? "engage"
                      : null;
              return (
                <li
                  key={item.href + item.label}
                  className="relative"
                  onMouseEnter={() => panelId && setDesktopOpen(panelId)}
                  onMouseLeave={() => setDesktopOpen(null)}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={panelId ? "true" : undefined}
                    aria-expanded={panelId ? desktopOpen === panelId : undefined}
                    className={
                      item.emphasize
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
                  {panelId && desktopOpen === panelId && (
                    <div className="absolute left-0 top-full z-50 min-w-[13rem] pt-2" role="menu">
                      <div className="rounded-lg border border-zinc-800 bg-[#0b0c0b] py-2 shadow-xl">
                        {navGroups
                          .find((g) => g.id === panelId)
                          ?.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              role="menuitem"
                              className={linkClass(isActive(pathname, sub.href), sub.emphasize)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label="Primary tablet" className="hidden items-center md:flex lg:hidden">
          <ul className="flex items-center gap-0 text-xs text-zinc-300 sm:text-sm">
            {[
              { href: "/", label: "Imperium" },
              { href: "/observatory", label: "Observatory" },
              { href: "/verify", label: "Verify", emphasize: true as const },
              { href: "/evaluate", label: "Evaluate" },
              { href: "/institutional-pilots", label: "Pilots" },
            ].map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      item.emphasize
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

        <div className="flex items-center gap-2">
          <Link
            href="/verify"
            className="hidden rounded-md border border-[#B8860B]/40 px-2.5 py-1.5 text-xs font-semibold text-[#F2D675] sm:inline-flex lg:hidden"
          >
            Verify
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-200 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id={menuId}
          className="border-t border-zinc-800 bg-[#090a09] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <nav className="mx-auto max-h-[min(80vh,32rem)] max-w-7xl overflow-y-auto px-4 py-4 sm:px-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Navigation
            </p>
            <ul className="space-y-3">
              {navGroups.map((group) => {
                const isOpen = expanded[group.id] ?? false;
                const panelId = `${menuId}-${group.id}`;
                const toneBorder =
                  group.tone === "proof"
                    ? "border-emerald-900/50"
                    : group.tone === "engage"
                      ? "border-[#B8860B]/35"
                      : "border-zinc-800";
                return (
                  <li key={group.id} className={`rounded-lg border ${toneBorder} bg-black/20`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-3 text-left"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setExpanded((s) => ({ ...s, [group.id]: !s[group.id] }))}
                    >
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                          group.tone === "proof"
                            ? "text-emerald-400/90"
                            : group.tone === "engage"
                              ? "text-[#D4AF37]"
                              : "text-zinc-400"
                        }`}
                      >
                        {group.label}
                      </span>
                      <span className="text-zinc-500" aria-hidden="true">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div id={panelId} hidden={!isOpen} className="border-t border-zinc-900/80 px-1 pb-2">
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={linkClass(isActive(pathname, item.href), item.emphasize)}
                              onClick={() => setOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
