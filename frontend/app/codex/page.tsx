import type { Metadata } from "next";
import Link from "next/link";
import { loadCodexBlueprint } from "./data";

export const metadata: Metadata = {
  title: "The Codex — Rastafarai Constitutional Articles",
  description: "The Seven Articles of the Rastafarai Codex: Containment, Observability, Interruptibility, Accountability, Proportionality, Reversibility, and Temporal Asymmetry.",
};

export default async function CodexPage() {
  const blueprint = await loadCodexBlueprint();

  const templateTypes = Array.from(new Set(blueprint.codex.map((article) => article.templateType).filter(Boolean))) as string[];
  const governanceThemes = Array.from(new Set(blueprint.codex.map((article) => article.governanceTheme).filter(Boolean))) as string[];

  const filteredArticles = blueprint.codex;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Rastafarai Codex</h1>
      <p>
        <strong>{blueprint.title}</strong> — {blueprint.description}
      </p>

      <section>
        <h2>Codex Articles</h2>
        <ul>
          {filteredArticles.map((article) => (
            <li key={article.article} style={{ marginBottom: "1rem" }}>
              <strong>
                <Link href={`/codex/${article.article}`}>Article {article.article} — {article.title}</Link>
              </strong>
              <div>{article.description}</div>
              <div>Template: {article.templateType ?? "unknown"}</div>
              <div>Theme: {article.governanceTheme ?? "unassigned"}</div>
              <div>
                Cross-links:{" "}
                {article.linksTo?.length
                  ? article.linksTo.map((linkedArticle, index) => (
                      <span key={linkedArticle}>
                        {index > 0 ? ", " : ""}
                        <Link href={`/codex/${linkedArticle}`}>Article {linkedArticle}</Link>
                      </span>
                    ))
                  : "None"}
              </div>
              <div>
                Revision history:{" "}
                {article.revisionHistory?.length
                  ? article.revisionHistory.map((revision, index) => (
                      <span key={revision.version}>
                        {index > 0 ? " → " : ""}
                        <Link href={`/codex/${article.article}`}>
                          {revision.version}
                        </Link>
                      </span>
                    ))
                  : "No revisions recorded"}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
