import type { Metadata } from "next";
import Link from "next/link";
import { loadCodexBlueprint } from "../../codex/data";

export const metadata: Metadata = { title: "Codex — Governance", description: "Canonical governance Codex index for the seven Rastafarai constitutional articles." };

export default async function GovernanceCodexPage() {
  const blueprint = await loadCodexBlueprint();
  return (
    <main className="container-page">
      <section className="py-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Governance / Codex</p>
        <h1 className="mt-4 text-4xl md:text-5xl text-gold-gradient">The Codex</h1>
        <p className="mt-3 text-lg text-zinc-400">{blueprint.title} — {blueprint.description}</p>
      </section>
      <section className="panel mt-4 p-8">
        <p className="text-lg leading-relaxed text-zinc-200">
          The Rastafarai Codex is the constitutional backbone of the architecture. Seven articles
          define the accountable boundaries for governed autonomous action.
        </p>
      </section>
      <div className="mt-8 space-y-4">
        {blueprint.codex.map((article) => (
          <Link key={article.article} href={`/codex/${article.article}`} className="panel block p-6 hover:scale-[1.01] transition-all">
            <h2 className="text-xl font-bold text-[#B8860B]">Article {article.article} — {article.title}</h2>
            <p className="mt-2 leading-relaxed text-zinc-300">{article.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
