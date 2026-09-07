/**
 * LayerCard — L1–L9 system layers.
 * Status must come from existing architecture/evidence data; do not invent.
 */
import React from "react";
import Link from "next/link";
import { StatusBadge, type EvidenceStatus } from "./StatusBadge";

export type LayerCardProps = {
  id: string; // e.g. "L7"
  title: string;
  description: string;
  status: EvidenceStatus;
  href?: string;
  emphasize?: boolean; // e.g. L7
  className?: string;
};

export function LayerCard({
  id,
  title,
  description,
  status,
  href,
  emphasize = false,
  className = "",
}: LayerCardProps) {
  const border = emphasize
    ? "border-[rgba(30,138,75,0.4)]"
    : "border-[rgba(242,214,117,0.2)]";
  const bg = emphasize ? "bg-[rgba(19,23,16,0.96)]" : "bg-[rgba(15,18,13,0.9)]";

  return (
    <article
      className={`rounded-xl border ${border} ${bg} p-4 transition-colors hover:border-[rgba(242,214,117,0.4)] sm:p-5 ${className}`}
      aria-label={`Layer ${id}: ${title}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-[#f2d675]">{id}</span>
        <StatusBadge status={status} />
      </div>
      <h3 className="mt-2 font-cinzel text-base tracking-wide text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-zinc-400">{description}</p>
      {href && (
        <Link
          href={href}
          className="mt-3 inline-block text-sm text-[#f2d675] hover:underline"
        >
          Explore layer →
        </Link>
      )}
    </article>
  );
}
