import { promises as fs } from "node:fs";
import path from "node:path";

export interface CodexRevision {
  version: string;
  updatedAt: string;
  summary: string;
}

export interface CodexArticle {
  article: string;
  title: string;
  description: string;
  templateType?: string;
  governanceTheme?: string;
  linksTo?: string[];
  revisionHistory?: CodexRevision[];
}

export interface BlueprintMetadata {
  architectureVersion?: string;
  sourceOfTruth?: string;
  artifactRole?: string;
}

export interface CodexBlueprint {
  version: string;
  title: string;
  description: string;
  metadata?: BlueprintMetadata;
  codex: CodexArticle[];
}

const BLUEPRINT_PATH = path.join(process.cwd(), "config", "blueprint-v3.5.json");
const ARTICLE_CONTENT_DIR = path.join(process.cwd(), "content", "codex", "articles");

export async function loadCodexBlueprint(): Promise<CodexBlueprint> {
  const file = await fs.readFile(BLUEPRINT_PATH, "utf-8");
  return JSON.parse(file) as CodexBlueprint;
}

export async function loadArticleBody(article: string): Promise<string | null> {
  const articlePath = path.join(ARTICLE_CONTENT_DIR, `${article}.md`);

  try {
    return await fs.readFile(articlePath, "utf-8");
  } catch {
    return null;
  }
}

export function findArticle(blueprint: CodexBlueprint, article: string): CodexArticle | undefined {
  return blueprint.codex.find((entry) => entry.article.toLowerCase() === article.toLowerCase());
}

export function getCanonicalSource(blueprint: CodexBlueprint) {
  return blueprint.metadata?.sourceOfTruth ?? "config/blueprint-v3.5.json";
}
