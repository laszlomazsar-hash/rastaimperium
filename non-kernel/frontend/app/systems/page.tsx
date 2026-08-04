import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Systems — EVO-V Ecosystem", description: "Canonical systems overview for applications, enterprise paths, and institutional pilots." };

const systems = [
  { title: "EVO-V Cloud Control", body: "Sovereign cloud orchestration with deterministic state management and audit-grade logging." },
  { title: "Enterprise AI Acquisition", body: "Structured enterprise pathway focused on governance, outcomes, and implementation confidence." },
  { title: "Institutional Pilots", body: "Pilot programs for regulated environments that require replay, traceability, and governance assurance." },
];

export default function SystemsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Systems</p>
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">Governed operational systems</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
        The systems path consolidates application, enterprise, and pilot narratives into a canonical
        information architecture for operational adoption.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {systems.map((system) => (
          <article key={system.title} className="rounded-xl border border-[#B8860B]/30 bg-black/30 p-6">
            <h2 className="text-xl font-semibold text-[#B8860B]">{system.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{system.body}</p>
          </article>
        ))}
      </div>
      <Link href="/systems/evo-g" className="mt-10 inline-block text-[#B8860B] hover:text-yellow-500">Explore EVO-G systems →</Link>
    </main>
  );
}
