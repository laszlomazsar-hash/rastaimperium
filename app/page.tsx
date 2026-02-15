"use client";

import { useBlueprint } from "../hooks/useBlueprint";

export default function HomePage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Rasta Imperium Blueprint...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>{blueprint.title}</h1>
      <p>{blueprint.description}</p>

      <section>
        <h2>Governance Stack</h2>
        <ul>
          {blueprint.governanceStack.map((layer) => (
            <li key={layer.layer}>
              <strong>
                L{layer.layer} — {layer.name}:
              </strong>{" "}
              {layer.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Codex Articles</h2>
        <ul>
          {blueprint.codex.map((article) => (
            <li key={article.article}>
              <strong>
                Article {article.article} — {article.title}:
              </strong>{" "}
              {article.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Consulting & Workshops</h2>
        <h3>
          {blueprint.consulting.flagship.name} (£{blueprint.consulting.flagship.price})
        </h3>
        <ul>
          {blueprint.consulting.flagship.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
