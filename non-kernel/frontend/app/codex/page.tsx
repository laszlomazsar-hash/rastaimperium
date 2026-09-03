import type { Metadata } from "next";
import Link from "next/link";
import { loadCodexBlueprint } from "./data";

export const metadata: Metadata = {
  title: "The Codex — Rastafarai Constitutional Articles",
  description:
    "The Seven Articles of the Rastafarai Codex: Containment, Observability, Interruptibility, Accountability, Proportionality, Reversibility, and Temporal Asymmetry.",
};

const articleColors: Record<string, string> = {
  1: "#107e3e",
  2: "#1e90ff",
  3: "#e01e1e",
  4: "#B8860B",
  5: "#9b59b6",
  6: "#e07c1e",
  7: "#2ecc71",
};

export default async function CodexPage() {
  const blueprint = await loadCodexBlueprint();
  const filteredArticles = blueprint.codex;

  return (
    <main className="container-page">
      <section className="py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
          Constitutional backbone
        </p>
        <h1 className="mt-4 text-4xl text-gold-gradient md:text-5xl">The Codex</h1>
        <p className="mt-3 text-lg text-zinc-400">
          {blueprint.title} — {blueprint.description}
        </p>
        <div className="mx-auto mt-4 h-0.5 w-24 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600" />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/pillars/"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-100"
          >
            Seven pillars
          </Link>
          <Link
            href="/proof/"
            className="rounded-lg border border-[#B8860B]/40 px-4 py-2 text-sm text-[#F2D675]"
          >
            Proof Registry
          </Link>
          <Link
            href="/product/"
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black"
          >
            Product pathway
          </Link>
        </div>
      </section>

      <section className="panel mt-4 p-8">
        <p className="text-lg leading-relaxed text-zinc-200">
          The Rastafarai Codex is the constitutional backbone of the architecture. Seven articles
          frame containment, observability, interruptibility, accountability, proportionality,
          reversibility, and temporal asymmetry. Article text here is constitutional design
          language — production enforcement claims require sealed evidence on the Proof surface.
        </p>
      </section>

      <div className="mt-8 space-y-4">
        {filteredArticles.map((article) => {
          const color = articleColors[article.article] || "#B8860B";
          return (
            <Link key={article.article} href={`/codex/${article.article}`} className="group block">
              <article
                className="panel p-6 transition-all duration-300 group-hover:scale-[1.01]"
                style={{ borderColor: color + "30" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2"
                    style={{ borderColor: color, color: color }}
                  >
                    <span className="font-courier font-bold">{article.article}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold" style={{ color: color }}>
                      Article {article.article} — {article.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-zinc-300">{article.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {article.templateType && (
                        <span className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400">
                          Template: {article.templateType}
                        </span>
                      )}
                      {article.governanceTheme && (
                        <span className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400">
                          Theme: {article.governanceTheme}
                        </span>
                      )}
                      {article.linksTo && article.linksTo.length > 0 && (
                        <span className="rounded border border-gold/30 px-2 py-1 text-xs text-gold">
                          Links to:{" "}
                          {article.linksTo.map((l: number | string) => `Art. ${l}`).join(", ")}
                        </span>
                      )}
                    </div>
                    {article.revisionHistory && article.revisionHistory.length > 0 && (
                      <div className="mt-2 text-xs text-zinc-500">
                        Revisions:{" "}
                        {article.revisionHistory
                          .map((r: { version: string }) => r.version)
                          .join(" → ")}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      <section className="mt-12 mb-16 rounded-xl border border-zinc-800 bg-black/20 p-8 text-center">
        <p className="text-sm leading-7 text-zinc-400">
          From codex language to adoption: inspect sealed capsules, map invariants in a design
          partner pilot, then scale runtime modules under written scope.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/proof/" className="text-sm text-[#F2D675]">
            Proof →
          </Link>
          <Link href="/institutional-pilots/" className="text-sm text-zinc-400">
            Pilots →
          </Link>
          <Link href="/applications/" className="text-sm text-zinc-400">
            Applications →
          </Link>
          <Link href="/thanks-and-praise/" className="text-sm text-zinc-400">
            Thanks & Praise →
          </Link>
        </div>
      </section>
    </main>
  );
}
