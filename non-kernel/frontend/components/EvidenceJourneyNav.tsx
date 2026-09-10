"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Institutional evidence journey — presentation only.
 * Does not perform verification or alter evidence status.
 */
const STEPS = [
  { href: "/observatory/", label: "Observe", short: "01" },
  { href: "/evidence/", label: "Inspect", short: "02" },
  { href: "/verify/", label: "Verify", short: "03" },
  { href: "/challenge/", label: "Challenge", short: "04" },
  { href: "/limitations/", label: "Limitations", short: "05" },
  { href: "/evaluate/", label: "Evaluate", short: "06" },
] as const;

function isActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, "") || "/";
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function EvidenceJourneyNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="Evidence evaluation journey"
      className="border-b border-zinc-900/80 bg-[#0b0c0b]/50"
    >
      <div className="container-page overflow-x-auto py-3">
        <ol className="flex min-w-max items-center gap-1 sm:gap-2">
          {STEPS.map((step, i) => {
            const active = isActive(pathname, step.href);
            return (
              <li key={step.href} className="flex items-center gap-1 sm:gap-2">
                {i > 0 && (
                  <span className="text-zinc-700" aria-hidden="true">
                    →
                  </span>
                )}
                <Link
                  href={step.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition sm:px-2.5 ${
                    active
                      ? "bg-[#D4AF37]/15 text-[#F2D675]"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  }`}
                >
                  <span className="text-zinc-600">{step.short}</span>
                  <span>{step.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
