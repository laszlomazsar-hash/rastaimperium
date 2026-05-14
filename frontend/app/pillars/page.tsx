import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "The Pillars — Seven Articles of Constitutional Governance",
  description: "Hardware-enforced constitutional physics: Containment, Observability, Interruptibility, Accountability, Proportionality, Reversibility, and Temporal Asymmetry.",
};

export default function PillarsPage() {
  const articles = [
    { num: "I", title: "Containment", desc: "All recursive systems operate within verifiable and non-negotiable boundaries. Class A (Complete) through Class D (Treaty-Governed) isolation levels." },
    { num: "II", title: "Observability", desc: "Every state transition is visible, auditable, and replayable. The Witness Layer enables overstanding from an elevated perspective." },
    { num: "III", title: "Interruptibility", desc: "Human overseers can halt the system regardless of its state. No autonomous action may override this article." },
    { num: "IV", title: "Accountability", desc: "Every decision is traceable to its origin. The L7 Immutable Logs provide SHA-256 hash-chained evidence." },
    { num: "V", title: "Proportionality", desc: "System capability is bounded by demonstrated safety. Power scales only with proven governance." },
    { num: "VI", title: "Reversibility", desc: "All actions must be reversible or their irreversibility must be explicitly acknowledged and approved." },
    { num: "VII", title: "Temporal Asymmetry", desc: "The rate of self-modification must decrease as system capability increases. Humans always possess more deliberation time than the system possesses for autonomous action." },
  ];

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold">The Pillars</h1>
        <p className="text-zinc-400 mt-3 text-lg">Seven Articles of the Rastafarai Codex — Hardware-Enforced Constitutional Physics</p>
      </section>

      <section className="panel p-8 mt-4">
        <p className="text-zinc-200 text-lg">Ethics forged in ancestral fire and emergence bound by sovereign code. From unbounded chaos to auditable ascent. These are not policy suggestions — they are physics. Hardware-enforced, mathematically sealed, constitutionally governed.</p>
      </section>

      <div className="grid gap-4 mt-8">
        {articles.map((a) => (
          <article key={a.num} className="panel p-6 flex gap-4">
            <span className="text-gold font-courier font-bold text-2xl w-12 shrink-0">{a.num}</span>
            <div>
              <h3 className="text-gold text-xl">{a.title}</h3>
              <p className="text-zinc-300 mt-2">{a.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="panel p-8 mt-8">
        <h2 className="text-2xl text-gold">The Lyapunov Vow</h2>
        <p className="text-zinc-200 mt-4">The mathematical guarantee that binds all articles together:</p>
        <p className="text-center text-3xl font-courier text-gold mt-6">dV/dt ≤ 0</p>
        <p className="text-center text-zinc-400 mt-3">Risk is non-increasing. The Recovery Score V measures dissonance in the Alpha Song. Stability is not hoped for — it is proven.</p>
      </section>

      <section className="panel p-8 mt-8">
        <h2 className="text-2xl text-gold">V0 Verifier Integrity</h2>
        <p className="text-zinc-200 mt-4">100% deterministic replay equivalence between the live state and the L7 Immutable Logs. Auditors can inject a SHA-256 hash into any portal to witness a deterministic replay of state history. The .evop file serves as a portable, court-grade evidence container.</p>
      </section>
    </main>
  );
}
