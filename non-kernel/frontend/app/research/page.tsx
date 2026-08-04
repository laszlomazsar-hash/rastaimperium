import type { Metadata } from "next";

export const metadata: Metadata = { title: "Research — Publications & Proofs", description: "Canonical research route for publications, artifacts, repositories, and witness-style verification concepts." };

const artifacts = [
  "Published works and constitutional documentation",
  "Digital artifacts including ARK Engine, Civilization Kernel, and .evop replay proofs",
  "Open-source repositories and evidence-oriented verification concepts",
];

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Research</p>
      <h1 className="mt-4 text-4xl font-bold">Research, artifacts, and proofs</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        Research consolidates the library and witness narratives into a canonical path for
        publications, technical artifacts, open repositories, and replay-verifiable proof concepts.
      </p>
      <ul className="mt-8 space-y-3">
        {artifacts.map((artifact) => (
          <li key={artifact} className="rounded-lg border border-zinc-800 p-4 text-zinc-200">{artifact}</li>
        ))}
      </ul>
    </main>
  );
}
