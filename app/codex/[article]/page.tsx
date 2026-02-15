import Link from "next/link";
import { findArticle, getCanonicalSource, loadArticleBody, loadCodexBlueprint } from "../data";

type Params = {
  article: string;
};

type SearchParams = {
  revision?: string;
};

export default async function CodexArticlePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const { article: articleParam } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const blueprint = await loadCodexBlueprint();
  const article = findArticle(blueprint, articleParam);

  if (!article) {
    return (
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Article not found in blueprint</h1>
        <p>Requested article identifier: {articleParam}</p>
        <p>
          Canonical source: <code>{getCanonicalSource(blueprint)}</code>
        </p>
        <p>Blueprint version: {blueprint.version}</p>
        <p>
          <Link href="/codex">Back to Codex index</Link>
        </p>
      </main>
    );
  }

  const body = await loadArticleBody(article.article);
  const selectedRevision = article.revisionHistory?.find((revision) => revision.version === resolvedSearchParams.revision);
  const latestRevision = article.revisionHistory?.[article.revisionHistory.length - 1];

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <p>
        <Link href="/codex">← Back to Codex index</Link>
      </p>
      <h1>
        Article {article.article} — {article.title}
      </h1>
      <p>{article.description}</p>

      <section>
        <h2>Metadata</h2>
        <ul>
          <li>Template type: {article.templateType ?? "unknown"}</li>
          <li>Governance theme: {article.governanceTheme ?? "unassigned"}</li>
          <li>Canonical source: {getCanonicalSource(blueprint)}</li>
          <li>Blueprint version: {blueprint.version}</li>
          <li>Rendered revision: {(selectedRevision ?? latestRevision)?.version ?? "n/a"}</li>
        </ul>
      </section>

      <section>
        <h2>Cross-links</h2>
        <p>
          {article.linksTo?.length
            ? article.linksTo.map((linkedArticle, index) => (
                <span key={linkedArticle}>
                  {index > 0 ? ", " : ""}
                  <Link href={`/codex/${linkedArticle}`}>Article {linkedArticle}</Link>
                </span>
              ))
            : "No linked articles"}
        </p>
      </section>

      <section>
        <h2>Revision history</h2>
        <ul>
          {article.revisionHistory?.map((revision) => (
            <li key={revision.version}>
              <Link href={`/codex/${article.article}?revision=${encodeURIComponent(revision.version)}`}>
                {revision.version}
              </Link>{" "}
              — {revision.updatedAt} — {revision.summary}
            </li>
          )) ?? <li>No revisions recorded</li>}
        </ul>
      </section>

      <section>
        <h2>Full article content</h2>
        {body ? (
          <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, border: "1px solid #ddd", padding: "1rem" }}>{body}</article>
        ) : (
          <div style={{ border: "1px solid #f3c", padding: "1rem", background: "#fff7fa" }}>
            <p>
              Article content file is missing for <strong>{article.article}</strong>.
            </p>
            <p>
              Expected file path: <code>content/codex/articles/{article.article}.md</code>
            </p>
            <p>
              Canonical source/version: {getCanonicalSource(blueprint)} @ {blueprint.version}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
