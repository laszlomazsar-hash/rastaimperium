"use client";

import { useBlueprint } from "../../hooks/useBlueprint";

export default function CodexPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Rasta Imperium Blueprint...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Rastafarai Codex</h1>
      <p>
        <strong>{blueprint.title}</strong> — {blueprint.description}
      </p>

      <section>
        <h2>Dynamic Article Templates</h2>
        <ul>
          {blueprint.codex.map((article) => (
            <li key={article.article}>
              <strong>
                Article {article.article} — {article.title} ({article.templateType}):
              </strong>{" "}
              {article.description}
              <br />
              Cross-links: {article.linksTo?.join(", ")}
              <br />
              Revisions: {article.revisionHistory?.map((revision) => `${revision.version} (${revision.updatedAt})`).join(" → ")}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
