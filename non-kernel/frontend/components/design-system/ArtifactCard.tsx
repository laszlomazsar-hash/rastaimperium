/**
 * ArtifactCard — distinct visual language for sealed evidence artifacts.
 * Presentation only.
 */
import React from "react";
import Link from "next/link";
import { StatusBadge, type EvidenceStatus } from "./StatusBadge";

export type ArtifactCardProps = {
  id: string;
  type: string;
  layer: string;
  status: EvidenceStatus;
  description: string;
  frozen?: boolean;
  verifyHref?: string;
  reproduceHref?: string;
  limitationsHref?: string;
  className?: string;
};

export function ArtifactCard({
  id,
  type,
  layer,
  status,
  description,
  frozen = true,
  verifyHref,
  reproduceHref,
  limitationsHref,
  className = "",
}: ArtifactCardProps) {
  return (
    <article
      className={`group rounded-xl border border-[rgba(30,138,75,0.3)] bg-[rgba(19,23,16,0.94)] transition-colors hover:border-[rgba(30,138,75,0.55)] ${className}`}
      aria-label={`Artifact ${id}`}
    >
      <div className="border-b border-[rgba(30,138,75,0.15)] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-[#f2d675]">{id}</span>
          <StatusBadge status={status} />
          {frozen && <StatusBadge status="FROZEN" />}
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          {type} · {layer}
        </p>
      </div>

      <div className="px-4 py-3 sm:px-5">
        <p className="text-sm leading-6 text-zinc-300">{description}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {verifyHref && (
            <Link href={verifyHref} className="text-[#f2d675] hover:underline">
              Verify →
            </Link>
          )}
          {reproduceHref && (
            <Link href={reproduceHref} className="text-zinc-400 hover:text-[#f2d675]">
              Reproduce offline →
            </Link>
          )}
          {limitationsHref && (
            <Link href={limitationsHref} className="text-zinc-500 hover:text-zinc-300">
              Limitations →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
