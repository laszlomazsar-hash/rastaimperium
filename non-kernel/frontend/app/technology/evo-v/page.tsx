import type { Metadata } from "next";

export const metadata: Metadata = { title: "EVO-V Kernel — Technology", description: "Canonical EVO-V execution-kernel overview." };

export default function EvoVTechnologyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Technology / EVO-V</p>
      <h1 className="mt-4 text-4xl font-bold">EVO-V Kernel</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        EVO-V is the execution kernel where deterministic governance logic runs. This frontend does
        not host runtime components; it documents architecture, principles, and institutional framing
        for a separate operational system.
      </p>
      <div className="mt-8 rounded-xl border border-[#B8860B]/30 bg-black/30 p-6">
        <h2 className="text-2xl text-[#B8860B]">Kernel responsibilities</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-zinc-300">
          <li>Guard lifecycle changes through explicit state-transition semantics.</li>
          <li>Preserve hash-linked audit lineage across committed operations.</li>
          <li>Support deterministic replay under identical inputs, versions, and event order.</li>
        </ul>
      </div>
    </main>
  );
}
