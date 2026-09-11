"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Canonical public assurance journey — Phase 22 consolidation.
 * Presentation only. Does not perform verification or alter evidence status.
 *
 * Observe → Inspect → Challenge → Verify → Reproduce → Assess → Crosswalk → Pilot → Decide
 */
export const ASSURANCE_JOURNEY_STEPS = [
  { href: "/product/", label: "Observe", short: "01", match: ["/product", "/observatory", "/"] },
  { href: "/proof/", label: "Inspect", short: "02", match: ["/proof", "/evidence"] },
  { href: "/challenge/", label: "Challenge", short: "03", match: ["/challenge"] },
  { href: "/verify/", label: "Verify", short: "04", match: ["/verify"] },
  { href: "/evidence/export/", label: "Reproduce", short: "05", match: ["/evidence/export"] },
  { href: "/limitations/", label: "Assess", short: "06", match: ["/limitations"] },
  { href: "/governance-crosswalk/", label: "Crosswalk", short: "07", match: ["/governance-crosswalk"] },
  { href: "/institutional-pilots/", label: "Pilot", short: "08", match: ["/institutional-pilots"] },
  { href: "/evaluate/", label: "Decide", short: "09", match: ["/evaluate", "/contact"] },
] as const;

function isActive(pathname: string, match: readonly string[]) {
  const p = pathname.replace(/\/$/, "") || "/";
  return match.some((m) => {
    if (m === "/") return p === "/";
    return p === m || p.startsWith(`${m}/`);
  });
}

export default function EvidenceJourneyNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="Public assurance journey"
      className="border-b border-zinc-900/80 bg-[#0b0c0b]/50"
    >
      <div className="container-page overflow-x-auto py-3">
        <ol className="flex min-w-max items-center gap-1 sm:gap-2">
          {ASSURANCE_JOURNEY_STEPS.map((step, i) => {
            const active = isActive(pathname, step.match);
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
