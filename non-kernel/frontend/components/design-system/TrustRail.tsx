/**
 * TrustRail — compact verification-first indicators.
 * Only statements supported by current public surface.
 */
import React from "react";

const ITEMS = [
  { label: "Verification-first", detail: "Claims stay labelled until artifacts exist" },
  { label: "Frozen evidence", detail: "Sealed L7 capsules with independent verifiers" },
  { label: "Offline reproduction", detail: "Node + Python pure verifiers, no network required" },
  { label: "Living manifest", detail: "Machine-readable status of every public claim" },
] as const;

export function TrustRail({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(11,12,11,0.9)] px-4 py-3 sm:px-5 ${className}`}
      aria-label="Verification-first indicators"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
        Evidence system
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.label} className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100">{item.label}</p>
            <p className="mt-0.5 text-xs leading-5 text-zinc-500">{item.detail}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
