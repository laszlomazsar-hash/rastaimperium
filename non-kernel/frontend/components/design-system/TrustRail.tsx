/**
 * TrustRail — compact verification-first indicators.
 * Only statements supported by current public surface.
 * Phase 27: stronger system continuity (sealed strip, not decorative cards).
 */
import React from "react";

const ITEMS = [
  { label: "Verification-first", detail: "Claims stay labelled until artifacts exist" },
  { label: "Frozen evidence", detail: "Sealed public capsules with independent verifiers" },
  { label: "Offline reproduction", detail: "Node + Python pure verifiers, no network required" },
  { label: "Living manifest", detail: "Machine-readable status of every public claim" },
] as const;

export function TrustRail({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`relative overflow-hidden rounded-xl border border-[rgba(242,214,117,0.22)] bg-[rgba(11,12,11,0.92)] px-4 py-3.5 sm:px-5 sm:py-4 ${className}`}
      aria-label="Verification-first indicators"
    >
      {/* Sealed left accent — system identity, not decoration */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#f2d675]/70 via-[#1e8a4b]/45 to-transparent"
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
        Evidence system
      </p>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3 lg:grid-cols-4 lg:gap-4">
        {ITEMS.map((item, i) => (
          <li
            key={item.label}
            className="relative min-w-0 pl-0 sm:pl-0"
          >
            {/* Subtle vertical rule between columns on large screens */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 top-1 hidden h-[calc(100%-0.25rem)] w-px bg-[rgba(242,214,117,0.12)] lg:block"
              />
            )}
            <p className="text-sm font-semibold tracking-tight text-zinc-100">
              {item.label}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-zinc-500">{item.detail}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
