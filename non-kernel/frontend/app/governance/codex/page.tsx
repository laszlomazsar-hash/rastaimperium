import type { Metadata } from "next";
import Link from "next/link";
import { loadCodexBlueprint } from "../../codex/data";

export const metadata: Metadata = {
  title: "Codex — Governance",
  description:
    "Canonical governance Codex index for the seven Rastafarai constitutional articles.",
};

export default async function GovernanceCodexPage() {
  const blueprint = await loadCodexBlueprint();
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Governance / Codex
          </p>
          <h1 className="mt-5 font-cinzel text-4xl text-gold-gradient sm:text-5xl">The Codex</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            {blueprint.title} — {blueprint.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/governance-model/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
            >
              Governance model
            </Link>
            <Link
              href="/pillars/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
            >
              Pillars (status labels)
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="royal-panel rounded-xl border p-6 sm:p-8">
          <p className="text-sm leading-7 text-zinc-300">
            The Rastafarai Codex is the constitutional backbone of the architecture. Seven articles
            define accountable boundaries for governed autonomous action. Treat article text as
            constitutional intent unless a sealed capsule is linked.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {blueprint.codex.map((article) => (
            <Link
              key={article.article}
              href={`/codex/${article.article}`}
              className="royal-panel block rounded-xl border p-6 transition hover:border-[#B8860B]/40"
            >
              <h2 className="text-xl font-semibold text-[#F2D675]">
                Article {article.article} — {article.title}
              </h2>
              <p className="mt-2 leading-relaxed text-zinc-400">{article.description}</p>
              <p className="mt-3 text-xs text-[#D4AF37]">Open article →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
