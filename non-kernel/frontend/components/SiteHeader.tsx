"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import RISeal from "./RISeal";
import {
  NAV_GROUPS,
  EXTERNAL_LINKS,
  activeGroupId,
  isPathActive,
  type NavGroup,
  type NavLink,
} from "./nav-config";

function LinkItem({
  item,
  active,
  onNavigate,
  role,
}: {
  item: NavLink;
  active: boolean;
  onNavigate?: () => void;
  role?: string;
}) {
  const className = item.emphasize
    ? `block rounded-md px-3 py-2.5 text-sm font-semibold transition ${
        active ? "bg-[#D4AF37]/20 text-[#F2D675]" : "text-[#F2D675] hover:bg-[#B8860B]/12"
      }`
    : `block rounded-md px-3 py-2.5 text-sm transition ${
        active
          ? "bg-[#B8860B]/12 text-[#F2D675]"
          : "text-zinc-300 hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
      }`;

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        role={role}
        className={className}
        onClick={onNavigate}
      >
        {item.label}
        <span className="ml-1 text-[10px] text-zinc-600" aria-hidden="true">
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      role={role}
      aria-current={active ? "page" : undefined}
      className={className}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

function menuItems(): HTMLElement[] {
  const menu = document.querySelector('[role="menu"]');
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const menuId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopTriggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  /** Blocks a single onFocus open after Escape focus restoration */
  const suppressFocusOpen = useRef(false);
  const currentGroup = activeGroupId(pathname);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Desktop: Escape close + arrow / Home / End within open submenu */
  useEffect(() => {
    if (!desktopOpen || mobileOpen) return;
    const openId = desktopOpen;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (closeTimer.current) clearTimeout(closeTimer.current);
        suppressFocusOpen.current = true;
        setDesktopOpen(null);
        requestAnimationFrame(() => {
          desktopTriggerRefs.current[openId]?.focus();
          requestAnimationFrame(() => {
            suppressFocusOpen.current = false;
          });
        });
        return;
      }

      const items = menuItems();
      if (items.length === 0) return;

      const active = document.activeElement as HTMLElement | null;
      const onTrigger = active === desktopTriggerRefs.current[openId];
      const idx = active ? items.indexOf(active) : -1;
      const inMenu = idx >= 0;

      if (!onTrigger && !inMenu) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (onTrigger || idx === items.length - 1) {
          items[0]?.focus();
        } else {
          items[idx + 1]?.focus();
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (onTrigger || idx <= 0) {
          items[items.length - 1]?.focus();
        } else {
          items[idx - 1]?.focus();
        }
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [desktopOpen, mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpen(null);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const next: Record<string, boolean> = {};
    for (const g of NAV_GROUPS) {
      next[g.id] =
        g.id === currentGroup || g.id === "evidence" || g.id === "verify";
    }
    setExpanded(next);
  }, [mobileOpen, currentGroup]);

  const openDesktop = (id: string) => {
    if (suppressFocusOpen.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDesktopOpen(id);
  };
  const scheduleCloseDesktop = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDesktopOpen(null), 120);
  };

  const topLinkClass = (group: NavGroup, active: boolean) => {
    const isProof = group.tone === "proof";
    if (isProof) {
      return `rounded-md px-2.5 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#D4AF37]/18 text-[#F2D675]"
          : "text-[#F2D675] hover:bg-[#B8860B]/12"
      }`;
    }
    return `rounded-md px-2.5 py-2 text-sm transition ${
      active
        ? "bg-[#B8860B]/12 text-[#F2D675]"
        : "text-zinc-300 hover:bg-[#B8860B]/10 hover:text-[#F2D675]"
    }`;
  };

  return (
    <header className="royal-header sticky top-0 z-50 border-b border-[rgba(242,214,117,0.2)] bg-[#090a09]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="royal-brand shrink-0"
          onClick={() => setMobileOpen(false)}
          aria-label="Rasta Imperium home"
        >
          <RISeal size={34} showWordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <ul className="flex items-center gap-0.5">
            {NAV_GROUPS.map((group) => {
              const active = currentGroup === group.id;
              const open = desktopOpen === group.id;
              return (
                <li
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => openDesktop(group.id)}
                  onMouseLeave={scheduleCloseDesktop}
                >
                  <Link
                    href={group.href}
                    ref={(el) => {
                      desktopTriggerRefs.current[group.id] = el;
                    }}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open}
                    className={topLinkClass(group, active)}
                    onFocus={() => openDesktop(group.id)}
                  >
                    {group.label}
                  </Link>
                  {open && (
                    <div
                      className="absolute left-0 top-full z-50 min-w-[14rem] pt-2"
                      role="menu"
                      onMouseEnter={() => openDesktop(group.id)}
                      onMouseLeave={scheduleCloseDesktop}
                    >
                      <div
                        className={`rounded-lg border py-2 shadow-xl ${
                          group.tone === "proof"
                            ? "border-emerald-900/40 bg-[#0b0c0b]"
                            : "border-zinc-800 bg-[#0b0c0b]"
                        }`}
                      >
                        {group.items.map((sub) => (
                          <LinkItem
                            key={sub.href + sub.label}
                            item={sub}
                            active={!sub.external && isPathActive(pathname, sub.href)}
                            role="menuitem"
                          />
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
          <ul className="flex items-center gap-0 text-sm">
            {NAV_GROUPS.filter((g) =>
              ["evidence", "verify", "architecture", "about"].includes(g.id)
            ).map((group) => {
              const active = currentGroup === group.id;
              return (
                <li key={group.id}>
                  <Link
                    href={group.href}
                    aria-current={active ? "page" : undefined}
                    className={topLinkClass(group, active)}
                  >
                    {group.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/verify"
            className="hidden rounded-md border border-[#B8860B]/45 bg-[#D4AF37]/10 px-2.5 py-1.5 text-xs font-semibold text-[#F2D675] transition hover:bg-[#D4AF37]/18 sm:inline-flex lg:hidden"
          >
            Verify
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-200 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{mobileOpen ? "Close" : "Menu"}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id={menuId}
          className="border-t border-zinc-800 bg-[#090a09] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <nav className="mx-auto max-h-[min(82vh,36rem)] max-w-7xl overflow-y-auto px-4 py-4 sm:px-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {NAV_GROUPS.map((group) => {
                const isOpen = expanded[group.id] ?? false;
                const panelId = `${menuId}-${group.id}`;
                const isProof = group.tone === "proof";
                return (
                  <li
                    key={group.id}
                    className={`rounded-lg border bg-black/25 ${
                      isProof ? "border-emerald-900/45" : "border-zinc-800"
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-3 text-left"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setExpanded((s) => ({ ...s, [group.id]: !s[group.id] }))
                      }
                    >
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                          isProof ? "text-emerald-400/90" : "text-zinc-400"
                        }`}
                      >
                        {group.label}
                      </span>
                      <span className="text-zinc-500" aria-hidden="true">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      id={panelId}
                      hidden={!isOpen}
                      className="border-t border-zinc-900/80 px-1 pb-2"
                    >
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.href + item.label}>
                            <LinkItem
                              item={item}
                              active={
                                !item.external && isPathActive(pathname, item.href)
                              }
                              onNavigate={() => setMobileOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 border-t border-zinc-900 pt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                External
              </p>
              <ul className="flex flex-wrap gap-3 text-sm text-zinc-500">
                {EXTERNAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#F2D675]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
