/**
 * LayerCard — L1–L9 system layers.
 * Status must come from existing architecture/evidence data; do not invent.
 * Visual upgrade: clearer emphasize treatment, refined hover, sealed feel for VERIFIED.
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
  const isVerified = status === "VERIFIED";

  const border = emphasize || isVerified
    ? "border-[rgba(30,138,75,0.42)]"
    : "border-[rgba(242,214,117,0.18)]";

  const bg = emphasize || isVerified
    ? "bg-[rgba(19,23,16,0.97)]"
    : "bg-[rgba(15,18,13,0.88)]";

  const hover = emphasize || isVerified
    ? "hover:border-[rgba(30,138,75,0.65)] hover:shadow-[0_0_28px_rgba(30,138,75,0.08)]"
    : "hover:border-[rgba(242,214,117,0.38)] hover:shadow-[0_0_24px_rgba(242,214,117,0.05)]";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border ${border} ${bg} p-4 transition-all duration-300 sm:p-5 ${hover} ${className}`}
      aria-label={`Layer ${id}: ${title}`}
    >
      {/* Subtle left accent for verified / emphasized layers */}
      {(emphasize || isVerified) && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-emerald-500/80 via-emerald-600/50 to-transparent"
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold tracking-wide text-[#f2d675]">
          {id}
        </span>
        <StatusBadge status={status} />
      </div>

      <h3 className="mt-2.5 font-cinzel text-base tracking-wide text-zinc-100 transition-colors group-hover:text-zinc-50">
        {title}
      </h3>

      <p className="mt-1.5 text-sm leading-6 text-zinc-400">{description}</p>

      {href && (
        <Link
          href={href}
          className="mt-3.5 inline-flex items-center gap-1 text-sm text-[#f2d675] transition-colors hover:text-[#f8e6a0] hover:underline"
        >
          Explore layer
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      )}
    </article>
  );
}
