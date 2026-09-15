/**
 * Canonical status badge — presentation only.
 * Does not alter underlying evidence claim statuses.
 * Visual upgrade: clearer weight, subtle sealed treatment for VERIFIED.
 */
import React from "react";

export type EvidenceStatus =
  | "VERIFIED"
  | "DEMONSTRATION"
  | "UNAVAILABLE"
  | "INVALID"
  | "SPEC_DRIFT"
  | "INDETERMINATE"
  | "MALFORMED";

/** Artifact / process labels that are not evidence claim statuses */
export type ProcessLabel =
  | "HISTORICAL"
  | "EARNED"
  | "OPEN"
  | "FROZEN"
  | "SEALED";

type StatusBadgeProps = {
  status: EvidenceStatus | ProcessLabel;
  size?: "sm" | "md";
  className?: string;
};

const EVIDENCE_STYLES: Record<
  EvidenceStatus,
  { bg: string; border: string; text: string; mark: string; extra?: string }
> = {
  VERIFIED: {
    bg: "bg-[rgba(30,138,75,0.16)]",
    border: "border-[rgba(30,138,75,0.55)]",
    text: "text-emerald-200",
    mark: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)]",
    extra: "shadow-[0_0_12px_rgba(30,138,75,0.12)]",
  },
  DEMONSTRATION: {
    bg: "bg-[rgba(184,135,24,0.14)]",
    border: "border-[rgba(184,135,24,0.48)]",
    text: "text-amber-100",
    mark: "bg-amber-400",
  },
  UNAVAILABLE: {
    bg: "bg-[rgba(92,99,88,0.12)]",
    border: "border-[rgba(92,99,88,0.4)]",
    text: "text-zinc-500",
    mark: "bg-zinc-600",
  },
  INVALID: {
    bg: "bg-[rgba(169,45,45,0.16)]",
    border: "border-[rgba(169,45,45,0.55)]",
    text: "text-red-200",
    mark: "bg-red-400",
  },
  SPEC_DRIFT: {
    bg: "bg-[rgba(196,122,44,0.14)]",
    border: "border-[rgba(196,122,44,0.5)]",
    text: "text-orange-200",
    mark: "bg-orange-400",
  },
  INDETERMINATE: {
    bg: "bg-[rgba(107,114,128,0.14)]",
    border: "border-[rgba(107,114,128,0.45)]",
    text: "text-zinc-300",
    mark: "bg-zinc-400",
  },
  MALFORMED: {
    bg: "bg-[rgba(127,29,29,0.2)]",
    border: "border-[rgba(127,29,29,0.6)]",
    text: "text-red-100",
    mark: "bg-red-500",
  },
};

const PROCESS_STYLES: Record<
  ProcessLabel,
  { bg: string; border: string; text: string; mark: string; extra?: string }
> = {
  HISTORICAL: {
    bg: "bg-zinc-900/60",
    border: "border-zinc-600",
    text: "text-zinc-400",
    mark: "bg-zinc-500",
  },
  EARNED: {
    bg: "bg-[rgba(30,138,75,0.12)]",
    border: "border-emerald-800/55",
    text: "text-emerald-300",
    mark: "bg-emerald-500",
  },
  OPEN: {
    bg: "bg-[rgba(184,135,24,0.12)]",
    border: "border-amber-700/55",
    text: "text-amber-200",
    mark: "bg-amber-400",
  },
  FROZEN: {
    bg: "bg-zinc-900/75",
    border: "border-sky-800/50",
    text: "text-sky-200",
    mark: "bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.4)]",
  },
  SEALED: {
    bg: "bg-zinc-900/75",
    border: "border-sky-800/50",
    text: "text-sky-200",
    mark: "bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.4)]",
  },
};

export function StatusBadge({ status, size = "sm", className = "" }: StatusBadgeProps) {
  const isEvidence = status in EVIDENCE_STYLES;
  const styles = isEvidence
    ? EVIDENCE_STYLES[status as EvidenceStatus]
    : PROCESS_STYLES[status as ProcessLabel];

  const sizeCls =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1.5"
      : "px-2.5 py-1 text-xs gap-2";

  return (
    <span
      role="status"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center rounded border font-mono font-semibold uppercase tracking-[0.14em] transition-shadow duration-200 ${styles.bg} ${styles.border} ${styles.text} ${sizeCls} ${styles.extra ?? ""} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.mark}`}
      />
      {status}
    </span>
  );
}
