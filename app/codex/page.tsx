import Link from "next/link";
import { loadCodexBlueprint } from "./data";

type SearchParams = {
  template?: string;
  theme?: string;
};

export default async function CodexPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const blueprint = await loadCodexBlueprint();
  const resolvedSearchParams = (await searchParams) ?? {};

  const templateFilter = resolvedSearchParams.template;
  const themeFilter = resolvedSearchParams.theme;

  const templateTypes = Array.from(new Set(blueprint.codex.map((article) => article.templateType).filter(Boolean))) as string[];
  const governanceThemes = Array.from(new Set(blueprint.codex.map((article) => article.governanceTheme).filter(Boolean))) as string[];

  const filteredArticles = blueprint.codex.filter((article) => {
    const matchesTemplate = !templateFilter || article.templateType === templateFilter;
    const matchesTheme = !themeFilter || article.governanceTheme === themeFilter;
    return matchesTemplate && matchesTheme;
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Rastafarai Codex</h1>
      <p>
        <strong>{blueprint.title}</strong> — {blueprint.description}
      </p>

      <section>
        <h2>Filter by template type</h2>
        <p>
          <Link href="/codex">All</Link>
          {templateTypes.map((templateType) => (
            <span key={templateType} style={{ marginLeft: "1rem" }}>
              <Link href={`/codex?template=${encodeURIComponent(templateType)}${themeFilter ? `&theme=${encodeURIComponent(themeFilter)}` : ""}`}>
                {templateType}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section>
        <h2>Filter by governance theme</h2>
        <p>
          <Link href="/codex">All</Link>
          {governanceThemes.map((theme) => (
            <span key={theme} style={{ marginLeft: "1rem" }}>
              <Link href={`/codex?theme=${encodeURIComponent(theme)}${templateFilter ? `&template=${encodeURIComponent(templateFilter)}` : ""}`}>
                {theme}
              </Link>
            </span>
          ))}
        </p>
      </section>

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
                        <Link href={`/codex/${article.article}?revision=${encodeURIComponent(revision.version)}`}>
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
