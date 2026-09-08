/**
 * TrustLadder — compact public verification path.
 * Presentation only. Does not perform verification.
 * Sequence: Manifest → Proof → Verify → Audit → Reproduce Offline → Limitations
 */
import React from "react";
import Link from "next/link";

const STEPS = [
  {
    id: "manifest",
    label: "Manifest",
    detail: "Public index of claims and evidence status.",
    href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.md",
    external: true,
  },
  {
    id: "proof",
    label: "Proof",
    detail: "Evidence registry and sealed capsules.",
    href: "/proof/",
    external: false,
  },
  {
    id: "verify",
    label: "Verify",
    detail: "Understand the public verification surface.",
    href: "/verify/",
    external: false,
  },
  {
    id: "audit",
    label: "Audit",
    detail: "Auditor handoff and verification ladder.",
    href: "/audit/",
    external: false,
  },
  {
    id: "reproduce",
    label: "Reproduce offline",
    detail: "Run the pure verifier independently.",
    href: "/audit/",
    external: false,
    emphasize: true,
  },
  {
    id: "limitations",
    label: "Limitations",
    detail: "What is not currently established.",
    href: "/limitations/",
    external: false,
  },
] as const;

type TrustLadderProps = {
  /** compact = single-row chips; full = labelled steps */
  variant?: "full" | "compact";
  className?: string;
  /** Highlight the current step id when known */
  current?: (typeof STEPS)[number]["id"];
};

export function TrustLadder({
  variant = "full",
  className = "",
  current,
}: TrustLadderProps) {
  if (variant === "compact") {
    return (
      <nav
        aria-label="Verification path"
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${className}`}
      >
        {STEPS.map((step, i) => {
          const isCurrent = current === step.id;
          const cls = isCurrent
            ? "font-semibold text-[#F2D675]"
            : step.emphasize
              ? "text-[#F2D675] hover:underline"
              : "text-zinc-400 hover:text-[#F2D675]";
          const content = step.external ? (
            <a
              key={step.id}
              href={step.href}
              target="_blank"
              rel="noreferrer"
              className={cls}
            >
              {step.label}
            </a>
          ) : (
            <Link key={step.id} href={step.href} className={cls}>
              {step.label}
            </Link>
          );
          return (
            <React.Fragment key={step.id}>
              {i > 0 && (
                <span aria-hidden="true" className="text-zinc-600">
                  →
                </span>
              )}
              {content}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Verification path: Manifest to Limitations"
      className={`rounded-xl border border-[rgba(242,214,117,0.22)] bg-[rgba(11,12,11,0.9)] px-4 py-4 sm:px-5 ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
        Verification path
      </p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">
        The site exposes evidence and context. Independent offline reproduction is the strongest
        verification boundary — do not treat the website UI as cryptographic authority.
      </p>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => {
          const isCurrent = current === step.id;
          const inner = (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  isCurrent || step.emphasize ? "text-[#F2D675]" : "text-zinc-100"
                }`}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-zinc-500">{step.detail}</p>
            </>
          );

          const boxCls = `block min-w-0 rounded-lg border px-3 py-2.5 transition ${
            isCurrent
              ? "border-[#D4AF37]/60 bg-[#D4AF37]/08"
              : "border-zinc-800 hover:border-[rgba(242,214,117,0.35)]"
          }`;

          return (
            <li key={step.id}>
              {step.external ? (
                <a href={step.href} target="_blank" rel="noreferrer" className={boxCls}>
                  {inner}
                </a>
              ) : (
                <Link href={step.href} className={boxCls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
