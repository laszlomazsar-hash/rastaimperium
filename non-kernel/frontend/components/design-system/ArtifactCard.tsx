/**
 * ArtifactCard — distinct visual language for sealed evidence artifacts.
 * Presentation only.
 * Visual upgrade: stronger sealed treatment, left accent, refined hover & hierarchy.
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
  const isVerified = status === "VERIFIED";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isVerified
          ? "border-[rgba(30,138,75,0.38)] bg-[rgba(19,23,16,0.96)] hover:border-[rgba(30,138,75,0.62)] hover:shadow-[0_0_32px_rgba(30,138,75,0.1)]"
          : "border-[rgba(242,214,117,0.22)] bg-[rgba(15,18,13,0.92)] hover:border-[rgba(242,214,117,0.4)]"
      } ${className}`}
      aria-label={`Artifact ${id}`}
    >
      {/* Sealed left accent */}
      {isVerified && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-emerald-400/90 via-emerald-600/60 to-emerald-900/20"
        />
      )}

      <div
        className={`border-b px-4 py-3.5 sm:px-5 ${
          isVerified
            ? "border-[rgba(30,138,75,0.18)]"
            : "border-[rgba(242,214,117,0.12)]"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold tracking-tight text-[#f2d675]">
            {id}
          </span>
          <StatusBadge status={status} />
          {frozen && <StatusBadge status="FROZEN" />}
        </div>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          {type} · {layer}
        </p>
      </div>

      <div className="px-4 py-3.5 sm:px-5">
        <p className="text-sm leading-6 text-zinc-300">{description}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {verifyHref && (
            <Link
              href={verifyHref}
              className="font-medium text-[#f2d675] transition-colors hover:text-[#f8e6a0] hover:underline"
            >
              Verify →
            </Link>
          )}
          {reproduceHref && (
            <Link
              href={reproduceHref}
              className="text-zinc-400 transition-colors hover:text-[#f2d675]"
            >
              Reproduce offline →
            </Link>
          )}
          {limitationsHref && (
            <Link
              href={limitationsHref}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Limitations →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
