export default function WitnessPage() {
  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold">The Witness Portal</h1>
        <p className="text-zinc-400 mt-3 text-lg">Constitutional Observatory — Civilization Telemetry</p>
      </section>

      {/* LIVE STATE PANEL */}
      <section className="panel p-8 mt-4 font-courier">
        <p className="text-gold text-xs mb-4">SYSTEM STATE — REAL-TIME</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-zinc-500 text-xs">COHERENCE SCORE</p>
            <p className="text-4xl text-gold font-bold mt-1">0.94</p>
            <p className="text-xs text-green-400 mt-1">▲ STABLE</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">ACTIVE AGENTS</p>
            <p className="text-4xl text-gold font-bold mt-1">2,048</p>
            <p className="text-xs text-green-400 mt-1">ALL GOVERNED</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">INVARIANT STATUS</p>
            <p className="text-4xl text-green-400 font-bold mt-1">HOLDING</p>
            <p className="text-xs text-zinc-400 mt-1">7/7 Articles enforced</p>
          </div>
        </div>
      </section>

      {/* REPLAY INTERFACE */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Replay Engine</h2>
        <p className="text-zinc-400 mt-2">Input any SHA-256 hash to witness a deterministic replay of state history</p>
        <div className="panel p-6 mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter SHA-256 hash..."
              className="flex-1 rounded-md border border-gold/40 bg-black px-4 py-3 text-zinc-100 font-courier text-sm"
              aria-label="Hash input"
            />
            <button className="rounded-md bg-gold text-black px-6 py-3 font-bold hover:bg-yellow-600 transition">
              Replay
            </button>
          </div>
          <div className="mt-6 border border-gold/20 rounded-lg p-4 font-courier text-sm text-zinc-400">
            <p className="text-gold text-xs mb-2">REPLAY OUTPUT</p>
            <p>awaiting hash input...</p>
            <p className="text-xs text-zinc-600 mt-4">The .evop file serves as a portable, court-grade evidence container.</p>
          </div>
        </div>
      </section>

      {/* GOVERNANCE TOPOLOGY */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Governance Topology</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="panel p-6">
            <p className="text-gold font-bold text-sm">Causal Flow Map</p>
            <div className="mt-4 font-courier text-xs text-zinc-400 space-y-1">
              <p>intent → verify → constrain → reason → act</p>
              <p>  ↓        ↓         ↓         ↓      ↓</p>
              <p>log      log       log       log    log</p>
              <p>  ↓        ↓         ↓         ↓      ↓</p>
              <p>═══════ L7 IMMUTABLE LEDGER ═══════════</p>
            </div>
          </div>
          <div className="panel p-6">
            <p className="text-gold font-bold text-sm">Invariant Topology</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-zinc-300">I. Containment</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">II. Observability</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">III. Interruptibility</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">IV. Accountability</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">V. Proportionality</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">VI. Reversibility</span><span className="text-green-400">●</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-300">VII. Temporal Asymmetry</span><span className="text-green-400">●</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNANCE EVENTS */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Governance Events</h2>
        <div className="panel p-6 mt-4 font-courier text-sm">
          <div className="space-y-3 text-zinc-300">
            <div className="flex gap-4"><span className="text-zinc-500 shrink-0">09:41:03</span><span className="text-green-400">PASS</span><span>Agent #1847 intent verified — Article IV satisfied</span></div>
            <div className="flex gap-4"><span className="text-zinc-500 shrink-0">09:41:02</span><span className="text-green-400">PASS</span><span>Drift check Δ=0.001 — within tolerance</span></div>
            <div className="flex gap-4"><span className="text-zinc-500 shrink-0">09:41:01</span><span className="text-green-400">PASS</span><span>Bayesian calibration cycle completed — no update required</span></div>
            <div className="flex gap-4"><span className="text-zinc-500 shrink-0">09:40:58</span><span className="text-gold">INFO</span><span>Replay proof #847,291 sealed to ledger</span></div>
            <div className="flex gap-4"><span className="text-zinc-500 shrink-0">09:40:55</span><span className="text-green-400">PASS</span><span>Lyapunov condition: dV/dt = -0.003 ≤ 0</span></div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="mt-8 pb-12">
        <h2 className="text-2xl text-gold">System Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="panel p-4 text-center">
            <p className="text-2xl font-bold text-gold font-courier">1,548+</p>
            <p className="text-xs text-zinc-400 mt-1">ops/sec</p>
          </div>
          <div className="panel p-4 text-center">
            <p className="text-2xl font-bold text-gold font-courier">≤45ms</p>
            <p className="text-xs text-zinc-400 mt-1">P99 latency</p>
          </div>
          <div className="panel p-4 text-center">
            <p className="text-2xl font-bold text-gold font-courier">99.7%</p>
            <p className="text-xs text-zinc-400 mt-1">success rate</p>
          </div>
          <div className="panel p-4 text-center">
            <p className="text-2xl font-bold text-gold font-courier">847K+</p>
            <p className="text-xs text-zinc-400 mt-1">blocks sealed</p>
          </div>
        </div>
      </section>
    </main>
  );
}
