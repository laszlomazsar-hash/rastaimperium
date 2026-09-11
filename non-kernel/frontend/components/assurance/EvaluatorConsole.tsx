"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { StatusBadge } from "@/components/design-system";
import {
  EVALUATOR_ARTIFACTS,
  EVALUATOR_CHECKLIST,
  listEvaluatorStages,
  type EvaluatorStageId,
} from "@/data/evidence/evaluator";

const STORAGE_KEY = "ri-evaluator-checklist-v1";

function loadChecklist(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function EvaluatorConsole() {
  const stages = listEvaluatorStages();
  const [active, setActive] = useState<EvaluatorStageId>("define");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => loadChecklist());

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* local only; ignore quota */
      }
      return next;
    });
  }, []);

  const activeStage = stages.find((s) => s.id === active) ?? stages[0];

  return (
    <div className="space-y-10">
      {/* Workflow rail */}
      <nav aria-label="Evaluation workflow" className="overflow-x-auto">
        <ol className="flex min-w-max gap-1 sm:flex-wrap sm:min-w-0">
          {stages.map((s, i) => {
            const isActive = s.id === active;
            return (
              <li key={s.id} className="flex items-center gap-1">
                {i > 0 && (
                  <span aria-hidden="true" className="px-1 text-zinc-600">
                    →
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`rounded-md px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] ${
                    isActive
                      ? "bg-[#D4AF37]/15 text-[#F2D675]"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  }`}
                >
                  {s.n} {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Active stage detail */}
      <section
        aria-labelledby={`stage-${activeStage.id}`}
        className="rounded-xl border border-[rgba(242,214,117,0.22)] bg-[rgba(15,18,13,0.92)] p-5 sm:p-6"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
          {activeStage.label}
        </p>
        <h2
          id={`stage-${activeStage.id}`}
          className="mt-2 font-cinzel text-2xl text-zinc-100"
        >
          {activeStage.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          {activeStage.body}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={activeStage.href}
            className="rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
          >
            {activeStage.linkLabel}
          </Link>
          {activeStage.secondary?.map((sec) => (
            <Link
              key={sec.href}
              href={sec.href}
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              {sec.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Evidence strip */}
      <section aria-labelledby="evaluator-evidence">
        <h2
          id="evaluator-evidence"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90"
        >
          Public evidence referenced
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Capsule-scoped VERIFIED only. Production authority is not established on this
          surface. The UI is not the authority.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {EVALUATOR_ARTIFACTS.map((a) => (
            <li
              key={a.artifactId}
              className="rounded-xl border border-emerald-900/35 bg-emerald-950/10 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="VERIFIED" />
                <StatusBadge status="FROZEN" />
              </div>
              <p className="mt-3 font-mono text-sm text-[#F2D675]">{a.artifactId}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {a.invariant}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link href={a.receiptHref} className="text-[#F2D675] hover:underline">
                  Receipt →
                </Link>
                <a href={a.artifactHref} className="text-zinc-400 hover:text-[#F2D675]">
                  Artifact →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Checklist — no score */}
      <section
        aria-labelledby="evaluator-checklist"
        className="rounded-xl border border-zinc-800 bg-black/25 p-5 sm:p-6"
      >
        <h2
          id="evaluator-checklist"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]"
        >
          Evaluation checklist
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Local inspection aid only. It does not compute a score, change evidence status,
          or constitute institutional approval.
        </p>
        <ul className="mt-5 space-y-2">
          {EVALUATOR_CHECKLIST.map((item) => {
            const isOn = Boolean(checked[item.id]);
            return (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-zinc-900/60">
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => toggle(item.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-600 bg-black text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Decision pathways */}
      <section aria-labelledby="evaluator-decide">
        <h2
          id="evaluator-decide"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]"
        >
          Decision pathways
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Workflow choices for the evaluator — not approvals issued by Rasta Imperium.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/proof/", label: "Continue inspection", body: "More public evidence." },
            { href: "/challenge/", label: "Challenge further", body: "Supported challenges only." },
            {
              href: "/institutional-pilots/",
              label: "Request design-partner pilot",
              body: "Bounded evaluation under institutional controls.",
            },
            {
              href: "/limitations/",
              label: "Stop / insufficient evidence",
              body: "Public surface may not justify the next step.",
            },
            {
              href: "/contact/?intent=institutional",
              label: "Proceed to internal review",
              body: "Take evidence into your governance process.",
            },
            {
              href: "/verify/",
              label: "Verify offline",
              body: "Reproduce with pure verifiers.",
            },
          ].map((d) => (
            <li
              key={d.href + d.label}
              className="rounded-xl border border-zinc-800 bg-black/25 p-4"
            >
              <Link
                href={d.href}
                className="text-sm font-semibold text-[#F2D675] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
              >
                {d.label} →
              </Link>
              <p className="mt-1.5 text-xs leading-5 text-zinc-500">{d.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
