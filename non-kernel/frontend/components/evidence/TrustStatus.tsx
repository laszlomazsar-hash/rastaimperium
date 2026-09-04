import Link from "next/link";
import { trustConsole } from "../../data/evidence/manifest";
import { ProvenanceBadge } from "./ProvenanceBadge";

/**
 * Trust Status — Rasta Royal panel treatment.
 * Compact mode for homepage; full mode for /trust.
 */
export function TrustStatus({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const snap = trustConsole;

  if (compact) {
    return (
      <div
        className={`royal-panel rounded-xl border border-[var(--royal-line)] bg-[linear-gradient(145deg,var(--royal-panel-strong),var(--royal-panel))] p-4 shadow-[var(--royal-shadow)] backdrop-blur-[12px] ${className}`}
        role="region"
        aria-label="Trust status summary"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--royal-gold)]">
              {snap.overallLabel}
            </p>
            <p className="mt-1 font-mono text-sm text-zinc-100">{snap.overallStatus}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ProvenanceBadge kind={snap.provenance} />
            <Link
              href="/trust"
              className="royal-button rounded-md border border-[rgba(242,214,117,0.4)] px-3 py-1.5 text-xs text-[var(--royal-gold)] transition hover:bg-[rgba(184,134,11,0.1)]"
            >
              Trust Console
            </Link>
          </div>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Trust sections">
          {snap.sections.map((s) => (
            <li key={s.id}>
              <Link
                href={s.verificationActionHref}
                className="inline-flex items-center gap-1.5 rounded border border-zinc-800 px-2 py-1 text-[11px] text-zinc-400 transition hover:border-[rgba(184,134,11,0.3)] hover:text-zinc-200"
              >
                <span className="font-medium text-zinc-300">{s.label}</span>
                <ProvenanceBadge kind={s.provenance} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section
      className={`royal-panel rounded-xl border border-[var(--royal-line)] bg-[linear-gradient(145deg,var(--royal-panel-strong),var(--royal-panel))] p-6 shadow-[var(--royal-shadow)] backdrop-blur-[12px] sm:p-8 ${className}`}
      aria-labelledby="trust-status-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--royal-gold)]">
            {snap.overallLabel}
          </p>
          <h2 id="trust-status-heading" className="mt-2 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
            {snap.overallStatus}
          </h2>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            version {snap.version} · as of {snap.asOf}
          </p>
        </div>
        <div className="royal-seal-wrap">
          <ProvenanceBadge kind={snap.provenance} />
        </div>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">{snap.notes}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {snap.sections.map((s) => (
          <article
            key={s.id}
            className="rounded-lg border border-zinc-800/90 bg-black/30 p-4 transition hover:border-[rgba(184,134,11,0.25)]"
            aria-label={`${s.label} trust section`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-zinc-100">{s.label}</h3>
              <ProvenanceBadge kind={s.provenance} />
            </div>
            <p className="mt-2 font-mono text-xs text-zinc-300">{s.status}</p>
            {(s.timestamp || s.version) && (
              <p className="mt-1 font-mono text-[10px] text-zinc-500">
                {s.version ? `v ${s.version}` : ""}
                {s.version && s.timestamp ? " · " : ""}
                {s.timestamp ?? ""}
              </p>
            )}
            {s.evidenceId && (
              <p className="mt-1 font-mono text-[10px] text-zinc-500">evidence: {s.evidenceId}</p>
            )}
            {s.proofId && (
              <p className="mt-0.5 font-mono text-[10px] text-zinc-500">proof: {s.proofId}</p>
            )}
            {s.notes && <p className="mt-2 text-xs leading-5 text-zinc-500">{s.notes}</p>}
            <Link
              href={s.verificationActionHref}
              className="mt-3 inline-block text-xs font-medium text-[var(--royal-gold)] transition hover:text-[#D4AF37]"
            >
              {s.verificationActionLabel} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
