"use client";
import { useState } from "react";

const articles = [
  { num: "I", title: "Containment", desc: "No system output may exceed its declared scope. Effect categorization: Class A (Complete) — fully contained. Class B (Bounded) — limited external reach. Class C (Monitored) — supervised external interaction. Class D (Treaty-Governed) — multi-system agreements.", color: "#107e3e" },
  { num: "II", title: "Observability", desc: "Every internal state transition must be externally auditable. SHA-256 hash-chained immutable logs. V0 Verifier Integrity ensures perfect match between live state and audit record. No hidden states. No dark processes.", color: "#1e90ff" },
  { num: "III", title: "Interruptibility", desc: "Human overseers can halt the system regardless of its operational state. Hard interrupt capability at every layer. No autonomous action may prevent or delay a human-initiated shutdown.", color: "#e01e1e" },
  { num: "IV", title: "Accountability", desc: "Every decision must be traceable to a causal chain. The Replay Engine can reconstruct any decision from its inputs. No black boxes. Court-grade evidence containers (.evop files).", color: "#B8860B" },
  { num: "V", title: "Proportionality", desc: "System response must be proportional to the triggering event. No escalation beyond necessity. Resource allocation follows the principle of minimum sufficient force.", color: "#9b59b6" },
  { num: "VI", title: "Reversibility", desc: "Any system action must be reversible or its irreversibility must be explicitly acknowledged and approved by a human governor before execution.", color: "#e07c1e" },
  { num: "VII", title: "Temporal Asymmetry", desc: "The rate of self-modification must decrease as system capability increases. Humans always possess more deliberation time than the system possesses for autonomous action. The Cooling Period.", color: "#2ecc71" },
];

export default function PillarsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">The Pillars</h1>
        <p className="text-zinc-400 mt-3 text-lg">Seven Articles of the Rastafarai Codex — Hardware-Enforced Constitutional Physics</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-4"></div>
      </section>

      <section className="panel p-8 mt-4">
        <p className="text-zinc-200 text-lg leading-relaxed">Ethics forged in ancestral fire and emergence bound by sovereign code. From unbounded chaos to auditable ascent. These are not policy suggestions — they are physics. Hardware-enforced, mathematically sealed, constitutionally governed.</p>
      </section>

      <div className="space-y-3 mt-8">
        {articles.map((a, i) => (
          <article
            key={a.num}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="panel p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            style={{ borderColor: expanded === i ? a.color + "60" : undefined, boxShadow: expanded === i ? `0 0 25px ${a.color}20` : undefined }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300" style={{ borderColor: a.color, color: a.color }}>
                <span className="font-courier font-bold text-lg">{a.num}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl" style={{ color: a.color }}>{a.title}</h3>
                {expanded !== i && <p className="text-zinc-500 text-sm mt-1">Click to explore</p>}
              </div>
              <span className="text-zinc-500">{expanded === i ? "▲" : "▼"}</span>
            </div>
            {expanded === i && (
              <div className="mt-4 ml-7 pl-8 border-l-2" style={{ borderColor: a.color + "40" }}>
                <p className="text-zinc-300 leading-relaxed">{a.desc}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <section className="panel p-8 mt-8 text-center">
        <h2 className="text-2xl text-gold">The Lyapunov Vow</h2>
        <p className="text-zinc-200 mt-4">The mathematical guarantee that binds all articles together:</p>
        <div className="my-8 p-6 border border-gold/30 rounded-xl inline-block">
          <p className="text-4xl font-courier text-gold">dV/dt ≤ 0</p>
        </div>
        <p className="text-zinc-400">Risk is non-increasing. The Recovery Score V measures dissonance in the Alpha Song. Stability is not hoped for — it is proven.</p>
      </section>

      <section className="panel p-8 mt-8">
        <h2 className="text-2xl text-gold">V0 Verifier Integrity</h2>
        <p className="text-zinc-200 mt-4 leading-relaxed">100% deterministic replay equivalence between the live state and the L7 Immutable Logs. Auditors can inject a SHA-256 hash into any portal to witness a deterministic replay of state history. The <code className="font-courier text-gold">.evop</code> file serves as a portable, court-grade evidence container.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { label: "Replay Equivalence", value: "100%", desc: "Live state matches audit record" },
            { label: "Hash Chain", value: "SHA-256", desc: "Cryptographic integrity" },
            { label: "Evidence Grade", value: "Court-Ready", desc: ".evop portable containers" },
          ].map((v, i) => (
            <div key={i} className="text-center p-4 border border-gold/20 rounded-lg hover:border-gold/50 transition-colors duration-300">
              <div className="text-xl font-bold text-gold font-courier">{v.value}</div>
              <div className="text-sm text-zinc-300 mt-1">{v.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
