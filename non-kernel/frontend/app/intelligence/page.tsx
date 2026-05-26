"use client";
import { useState } from "react";

const pipelineSteps = [
  { name: "Encode", icon: "", desc: "Input is encoded into the sovereign processing format. All data enters through the containment boundary.", color: "#107e3e" },
  { name: "Constrain", icon: "", desc: "Z3 theorem prover applies constitutional constraints. Only admissible operations proceed.", color: "#1e90ff" },
  { name: "Reason", icon: "", desc: "Crystal Consciousness processes through 5 geometric facets. NOTEARS ensures causal validity. Differentiable Relaxer optimizes.", color: "#B8860B" },
  { name: "Output", icon: "", desc: "Results are verified against all 7 Articles before release. SHA-256 hash committed to L7 Immutable Logs.", color: "#2ecc71" },
];

const tiers = [
  { name: "Codex Lite", price: "£49", period: "/month", features: ["5 governed AI agents", "Basic audit logs", "Email support", "Community access"], color: "#107e3e" },
  { name: "Codex Pro", price: "£299", period: "/month", features: ["50 governed agents", "Full replay engine", "Priority support", "Custom rule DSL", "API access"], color: "#B8860B", featured: true },
  { name: "Enterprise", price: "£2,000+", period: "/month", features: ["Unlimited agents", "On-premise deployment", "Dedicated support", "Custom integrations", "SLA guarantee"], color: "#1e90ff" },
  { name: "Sovereign License", price: "£5,000+", period: "one-time", features: ["Full source access", "Self-hosted forever", "No dependencies", "Constitutional customization", "Direct founder access"], color: "#9b59b6" },
];

export default function IntelligencePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">Intelligence</h1>
        <p className="text-zinc-400 mt-3 text-lg">Jah Conciseness — The Sovereign Processing Pipeline</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-4"></div>
      </section>

      <section className="panel p-8 mt-6">
        <p className="text-zinc-200 text-lg leading-relaxed">Jah Conciseness is the successor to the PNCR v2.3 architecture. It orchestrates 2,000+ Deep Seed Agents within a deterministic governance field, providing concise reasoning, coherent constraints, and dependable execution.</p>
      </section>

      <section className="panel p-8 mt-8">
        <h2 className="text-2xl text-gold">The Processing Pipeline</h2>
        <p className="text-zinc-300 mt-4">Every input passes through four sovereign gates. Click each stage to explore.</p>

        <div className="flex justify-center gap-2 mt-8">
          {pipelineSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="flex-1 p-4 rounded-lg border text-center transition-all duration-300"
              style={{
                borderColor: activeStep === i ? step.color : "#333",
                boxShadow: activeStep === i ? `0 0 20px ${step.color}30` : "none",
                opacity: activeStep === i ? 1 : 0.5,
              }}
            >
              <div className="text-2xl">{step.icon}</div>
              <div className="text-sm mt-2 font-bold" style={{ color: step.color }}>{step.name}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-1">
            {pipelineSteps.map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 rounded-full transition-colors duration-300" style={{ backgroundColor: i <= activeStep ? pipelineSteps[i].color : "#333" }}></div>
                {i < pipelineSteps.length - 1 && <div className="w-12 h-0.5 transition-colors duration-300" style={{ backgroundColor: i < activeStep ? pipelineSteps[i].color : "#333" }}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-6 rounded-lg border border-zinc-700 bg-black/30 transition-all duration-500">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{pipelineSteps[activeStep].icon}</span>
            <div>
              <h3 className="text-lg font-bold" style={{ color: pipelineSteps[activeStep].color }}>{pipelineSteps[activeStep].name}</h3>
              <p className="text-zinc-300 mt-1">{pipelineSteps[activeStep].desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel p-8 mt-8">
        <h2 className="text-2xl text-gold">Core Technologies</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[
            { name: "Z3 Theorem Prover", desc: "Formal verification of all constitutional constraints before execution. Mathematical proof, not probabilistic guessing.", icon: "️" },
            { name: "NOTEARS", desc: "Causal structure learning that ensures every decision has a valid causal chain. No spurious correlations.", icon: "" },
            { name: "Differentiable Relaxer", desc: "Continuous optimization within the admissible manifold. Smooth transitions between governance states.", icon: "∿" },
            { name: "Crystal Consciousness", desc: "5-facet geometric processing core: Input → Memory → Reasoning → Reflection → Integration. 1,548+ ops/sec.", icon: "" },
          ].map((tech, i) => (
            <div key={i} className="border border-gold/20 rounded-lg p-5 hover:border-gold/50 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tech.icon}</span>
                <h4 className="text-gold font-bold">{tech.name}</h4>
              </div>
              <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-gold text-center mb-8">Licensing & Access</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`panel p-6 text-center transition-all duration-300 hover:scale-105 ${tier.featured ? "ring-2 ring-gold/50" : ""}`}
            >
              {tier.featured && <div className="text-xs text-gold font-bold mb-2">RECOMMENDED</div>}
              <h3 className="text-lg font-bold" style={{ color: tier.color }}>{tier.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-zinc-500 text-sm"> {tier.period}</span>
              </div>
              <ul className="mt-4 space-y-2 text-left">
                {tier.features.map((f, j) => (
                  <li key={j} className="text-sm text-zinc-300 flex items-center gap-2">
                    <span style={{ color: tier.color }}></span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 text-center">
        <a href="https://jah.rastaimperium.com" className="inline-block rounded-md bg-gold text-black px-8 py-4 font-bold text-lg hover:bg-yellow-600 transition-colors duration-300">
          Enter jah.rastaimperium.com →
        </a>
      </section>
    </main>
  );
}
