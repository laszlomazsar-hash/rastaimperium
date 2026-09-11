/**
 * VerificationReceipt — Public assurance record.
 * Presentation only. The UI is never the authority.
 * Values are derived solely from the Living Evidence Manifest
 * and sealed public capsules. Missing values render "Not established".
 *
 * Phase 22 Step 5.
 */
"use client";

import React from "react";
import Link from "next/link";
import { StatusBadge, type EvidenceStatus } from "./StatusBadge";

/** Frontend-safe receipt payload. Never invent fields. */
export interface VerificationReceiptData {
  artifactId: string;
  artifactPath?: string;
  invariantId?: string;
  invariantDescription?: string;
  verifier?: {
    implementation?: string;
    path?: string;
    reproductionAvailable?: boolean;
  };
  /** Sealed artifact hash from capsule/manifest — not a verification result. */
  artifactHash?: string;
  /** Only populated when an actual pure-verifier run has produced a result. */
  expected?: string;
  observed?: string;
  status: EvidenceStatus;
  scope?: string;
  /** Always false for public capsules on this surface. */
  productionAuthority: false;
  limitations?: string[];
  artifactUrl?: string;
  verifierUrl?: string;
  reproductionUrl?: string;
  /** Optional process modifiers already present in the source. */
  modifiers?: Array<"FROZEN" | "HISTORICAL" | "SEALED">;
}

export type VerificationReceiptProps = {
  data: VerificationReceiptData;
  /** Compact variant for side panels / graphs. */
  compact?: boolean;
  className?: string;
  /** Optional machine-readable id for export / testing. */
  receiptId?: string;
};

function Field({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(8rem,11rem)_1fr] sm:gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#d4af37]">
        {label}
      </dt>
      <dd
        className={`text-sm leading-6 text-zinc-300 ${
          mono ? "font-mono text-xs break-all" : ""
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

function ValueOrNotEstablished({
  value,
  mono = false,
}: {
  value?: string | null;
  mono?: boolean;
}) {
  if (value == null || value === "") {
    return (
      <span className="text-zinc-500 italic" aria-label="Not established">
        Not established
      </span>
    );
  }
  return (
    <span className={mono ? "font-mono text-xs break-all" : undefined}>
      {value}
    </span>
  );
}

export function VerificationReceipt({
  data,
  compact = false,
  className = "",
  receiptId,
}: VerificationReceiptProps) {
  const {
    artifactId,
    invariantId,
    invariantDescription,
    verifier,
    artifactHash,
    expected,
    observed,
    status,
    scope,
    productionAuthority,
    limitations = [],
    artifactUrl,
    verifierUrl,
    reproductionUrl,
    modifiers = [],
  } = data;

  const id = receiptId ?? `receipt-${artifactId}`;

  return (
    <article
      id={id}
      data-receipt-id={id}
      data-artifact-id={artifactId}
      data-status={status}
      data-production-authority={String(productionAuthority)}
      className={`rounded-xl border border-[rgba(242,214,117,0.24)] bg-[rgba(19,23,16,0.94)] ${className}`}
      aria-labelledby={`${id}-title`}
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(242,214,117,0.12)] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id={`${id}-title`}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400"
          >
            Verification Receipt
          </h2>
          <StatusBadge status={status} />
          {modifiers.map((m) => (
            <StatusBadge key={m} status={m} />
          ))}
        </div>
        <span className="font-mono text-[10px] text-zinc-600">
          {artifactId}
        </span>
      </header>

      {/* Body */}
      <dl
        className={`space-y-3.5 px-4 py-4 sm:px-5 ${
          compact ? "sm:space-y-3" : "sm:space-y-4"
        }`}
      >
        <Field label="Artifact">
          <span className="font-mono text-xs text-[#f2d675]">{artifactId}</span>
        </Field>

        <Field label="Invariant">
          {invariantId ? (
            <span>
              <span className="font-mono text-xs text-zinc-200">
                {invariantId}
              </span>
              {invariantDescription ? (
                <span className="mt-0.5 block text-zinc-400">
                  {invariantDescription}
                </span>
              ) : null}
            </span>
          ) : (
            <ValueOrNotEstablished value={null} />
          )}
        </Field>

        <Field label="Verifier">
          {verifier?.implementation ? (
            <span>
              <span className="text-zinc-200">
                {verifier.implementation}
              </span>
              {verifier.reproductionAvailable ? (
                <span className="mt-0.5 block text-xs text-zinc-500">
                  Offline pure verifier · no network · no mutation
                </span>
              ) : (
                <span className="mt-0.5 block text-xs text-zinc-500">
                  Reproduction availability not established
                </span>
              )}
            </span>
          ) : (
            <ValueOrNotEstablished value={null} />
          )}
        </Field>

        {/* Hash semantics kept distinct */}
        <Field label="Artifact hash" mono>
          <ValueOrNotEstablished value={artifactHash} mono />
        </Field>

        <Field label="Expected" mono>
          <ValueOrNotEstablished value={expected} mono />
        </Field>

        <Field label="Observed" mono>
          <ValueOrNotEstablished value={observed} mono />
        </Field>

        <Field label="Status">
          <StatusBadge status={status} size="md" />
        </Field>

        <Field label="Scope">
          <ValueOrNotEstablished value={scope} />
        </Field>

        <Field label="Production authority">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            NOT ESTABLISHED
          </span>
        </Field>

        {limitations.length > 0 && (
          <Field label="Limitations">
            <ul className="list-disc space-y-1 pl-4 text-zinc-400">
              {limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </Field>
        )}
      </dl>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-[rgba(242,214,117,0.12)] px-4 py-3 sm:px-5">
        {artifactUrl && (
          <Link
            href={artifactUrl}
            className="inline-flex items-center rounded border border-[rgba(242,214,117,0.28)] bg-[rgba(242,214,117,0.06)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2d675] transition hover:border-[rgba(242,214,117,0.5)] hover:bg-[rgba(242,214,117,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
          >
            Inspect artifact
          </Link>
        )}
        {verifierUrl && (
          <Link
            href={verifierUrl}
            className="inline-flex items-center rounded border border-[rgba(242,214,117,0.28)] bg-[rgba(242,214,117,0.06)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f2d675] transition hover:border-[rgba(242,214,117,0.5)] hover:bg-[rgba(242,214,117,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
          >
            View verifier
          </Link>
        )}
        {reproductionUrl && (
          <Link
            href={reproductionUrl}
            className="inline-flex items-center rounded border border-[rgba(30,138,75,0.4)] bg-[rgba(30,138,75,0.08)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300 transition hover:border-[rgba(30,138,75,0.6)] hover:bg-[rgba(30,138,75,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Reproduce offline
          </Link>
        )}
      </div>

      {/* Authority notice — non-negotiable */}
      <footer className="border-t border-[rgba(242,214,117,0.08)] px-4 py-2.5 sm:px-5">
        <p className="font-mono text-[10px] leading-5 text-zinc-500">
          The UI is not the authority. Inspect the sealed artifact and verifier.
          This receipt is a presentation of public evidence only.
        </p>
      </footer>
    </article>
  );
}
