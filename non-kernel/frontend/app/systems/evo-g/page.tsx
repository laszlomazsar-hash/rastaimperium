import type { Metadata } from "next";

export const metadata: Metadata = { title: "EVO-G — Systems", description: "Canonical EVO-G systems route for governed operations." };

export default function EvoGSystemsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Systems / EVO-G</p>
      <h1 className="mt-4 text-4xl font-bold">EVO-G operational layer</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        EVO-G represents governed operational systems built around accountable controls, policy
        traceability, and deployment readiness for high-accountability environments.
      </p>
    </main>
  );
}
