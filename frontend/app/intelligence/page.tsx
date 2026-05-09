export default function IntelligencePage() {
  const pipeline = [
    { step: "Encode", desc: "Transform input into structured symbolic representation" },
    { step: "Constrain", desc: "Apply constitutional invariants and admissibility checks" },
    { step: "Reason", desc: "Symbolic logic (Z3), Causal Discovery (NOTEARS), Differentiable Relaxer" },
    { step: "Output", desc: "Deterministic, auditable, replayable decision" },
  ];

  const pricing = [
    { tier: "Starter", price: "£49/mo", features: "API access, 10K requests, basic reasoning" },
    { tier: "Professional", price: "£249/mo", features: "Full pipeline, causal discovery, priority support" },
    { tier: "Enterprise", price: "£1,500/mo", features: "Custom invariants, dedicated instance, SLA" },
    { tier: "Sovereign License", price: "£5,000+", features: "Full source, self-hosted, constitutional customization" },
  ];

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold">Jah Conciseness</h1>
        <p className="text-zinc-400 mt-3 text-lg">The Intelligence Engine — Precision Reasoning for Constitutional AI</p>
      </section>

      <section className="panel p-8 mt-4">
        <p className="text-zinc-200 text-lg">Jah Conciseness is the successor to the PNCR v2.3 architecture. It orchestrates 2,000+ Deep Seed Agents within a deterministic governance field, providing concise reasoning, coherent constraints, and dependable execution.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-gold text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {pipeline.map((p, i) => (
            <div key={p.step} className="panel p-5 text-center">
              <p className="text-gold font-courier text-sm">Step {i + 1}</p>
              <h3 className="text-gold text-xl mt-2">{p.step}</h3>
              <p className="text-sm text-zinc-300 mt-3">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold text-center">Core Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="panel p-6">
            <h4 className="text-gold font-bold">Symbolic Reasoning (Z3)</h4>
            <p className="text-sm text-zinc-300 mt-2">Formal verification of logical constraints. Every output is provably correct within the defined invariant space.</p>
          </div>
          <div className="panel p-6">
            <h4 className="text-gold font-bold">Causal Discovery (NOTEARS)</h4>
            <p className="text-sm text-zinc-300 mt-2">Identifies true causal relationships in data, not mere correlations. Structural equation models with acyclicity constraints.</p>
          </div>
          <div className="panel p-6">
            <h4 className="text-gold font-bold">Differentiable Relaxer</h4>
            <p className="text-sm text-zinc-300 mt-2">Bridges discrete symbolic logic with continuous optimization. Gradient-based refinement within constitutional bounds.</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold text-center">Pricing</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {pricing.map((p) => (
            <div key={p.tier} className="panel p-5 text-center">
              <h3 className="text-gold text-lg">{p.tier}</h3>
              <p className="text-2xl font-bold text-gold mt-2">{p.price}</p>
              <p className="text-sm text-zinc-400 mt-3">{p.features}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <a href="https://jah.rastaimperium.com" className="inline-block rounded-md bg-gold text-black px-8 py-4 font-bold text-lg hover:bg-yellow-600 transition">
          Enter jah.rastaimperium.com →
        </a>
      </section>
    </main>
  );
}
