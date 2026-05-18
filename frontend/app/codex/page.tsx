import type { Metadata } from "next";
import Link from "next/link";
import { loadCodexBlueprint } from "./data";

export const metadata: Metadata = {
  title: "The Codex — Rastafarai Constitutional Articles",
  description: "The Seven Articles of the Rastafarai Codex: Containment, Observability, Interruptibility, Accountability, Proportionality, Reversibility, and Temporal Asymmetry.",
};

const articleColors: Record<string, string> = {
  1: "#107e3e", 2: "#1e90ff", 3: "#e01e1e", 4: "#B8860B", 5: "#9b59b6", 6: "#e07c1e", 7: "#2ecc71",
};

export default async function CodexPage() {
  const blueprint = await loadCodexBlueprint();
  const filteredArticles = blueprint.codex;

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">The Codex</h1>
        <p className="text-zinc-400 mt-3 text-lg">{blueprint.title} — {blueprint.description}</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-4"></div>
      </section>

      <section className="panel p-8 mt-4">
        <p className="text-zinc-200 text-lg leading-relaxed">The Rastafarai Codex is the constitutional backbone of the entire architecture. Seven articles, each hardware-enforced, each mathematically sealed. These are the laws that govern all autonomous action within the sovereign system.</p>
      </section>

      <div className="space-y-4 mt-8">
        {filteredArticles.map((article) => {
          const color = articleColors[article.article] || "#B8860B";
          return (
            <Link key={article.article} href={`/codex/${article.article}`} className="block group">
              <article className="panel p-6 transition-all duration-300 group-hover:scale-[1.01]" style={{ borderColor: color + "30" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: color, color: color }}>
                    <span className="font-courier font-bold">{article.article}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold" style={{ color: color }}>Article {article.article} — {article.title}</h3>
                    <p className="text-zinc-300 mt-2 leading-relaxed">{article.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {article.templateType && (
                        <span className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400">Template: {article.templateType}</span>
                      )}
                      {article.governanceTheme && (
                        <span className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400">Theme: {article.governanceTheme}</span>
                      )}
                      {article.linksTo && article.linksTo.length > 0 && (
                        <span className="text-xs px-2 py-1 rounded border border-gold/30 text-gold">Links to: {article.linksTo.map((l: any) => `Art. ${l}`).join(", ")}</span>
                      )}
                    </div>
                    {article.revisionHistory && article.revisionHistory.length > 0 && (
                      <div className="mt-2 text-xs text-zinc-500">
                        Revisions: {article.revisionHistory.map((r: { version: string }) => r.version).join(" → ")}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
