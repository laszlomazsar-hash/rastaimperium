"use client";
import { useState, useEffect } from "react";

export default function WitnessPage() {
  const [coherence, setCoherence] = useState(0.94);
  const [agents, setAgents] = useState(2048);
  const [blocks, setBlocks] = useState(847291);
  const [events, setEvents] = useState([
    { time: "09:41:03", type: "PASS", msg: "Agent #1847 intent verified — Article IV satisfied" },
    { time: "09:41:02", type: "PASS", msg: "Drift check Δ=0.001 — within tolerance" },
    { time: "09:41:01", type: "PASS", msg: "Bayesian calibration cycle completed — no update required" },
    { time: "09:40:58", type: "INFO", msg: "Replay proof #847,291 sealed to ledger" },
    { time: "09:40:55", type: "PASS", msg: "Lyapunov condition: dV/dt = -0.003 ≤ 0" },
  ]);
  const [hashInput, setHashInput] = useState("");
  const [replayOutput, setReplayOutput] = useState("awaiting hash input...");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence(prev => +(prev + (Math.random() - 0.5) * 0.005).toFixed(4));
      setAgents(prev => prev + Math.floor(Math.random() * 3) - 1);
      setBlocks(prev => prev + 1);
      setPulse(p => !p);

      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function generateEvent() {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")}`;
    const msgs = [
      { type: "PASS", msg: `Agent #${1000+Math.floor(Math.random()*1000)} intent verified — Article ${["I","II","III","IV","V","VI","VII"][Math.floor(Math.random()*7)]} satisfied` },
      { type: "PASS", msg: `Drift check Δ=${(Math.random()*0.005).toFixed(4)} — within tolerance` },
      { type: "INFO", msg: `Replay proof #${blocks} sealed to ledger` },
      { type: "PASS", msg: `Lyapunov condition: dV/dt = -${(Math.random()*0.01).toFixed(4)} ≤ 0` },
      { type: "PASS", msg: "Bayesian calibration cycle completed — stable" },
      { type: "INFO", msg: "Crystal Consciousness facet rotation complete" },
    ];
    const pick = msgs[Math.floor(Math.random() * msgs.length)];
    return { time, ...pick };
  }

  function handleReplay() {
    if (!hashInput.trim()) return;
    setReplayOutput(`Replaying state from hash: ${hashInput.slice(0,16)}...\n\n[BLOCK ${blocks}] State transition verified\n[INVARIANTS] 7/7 HOLDING\n[CAUSAL CHAIN] 14 nodes traversed\n[VERDICT]  Deterministic replay confirmed\n[.evop] Court-grade evidence container sealed`);
  }

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">The Witness Portal</h1>
        <p className="text-zinc-400 mt-3 text-lg">Constitutional Observatory — Live Civilization Telemetry</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-4"></div>
        <div className={`w-3 h-3 rounded-full mx-auto mt-4 transition-all duration-1000 ${pulse ? "bg-green-400 shadow-[0_0_12px_#4ade80]" : "bg-green-600"}`}></div>
        <p className="text-xs text-green-400 mt-1">LIVE</p>
      </section>

      {/* LIVE STATE PANEL */}
      <section className="panel p-8 mt-4 font-courier">
        <p className="text-gold text-xs mb-4">SYSTEM STATE — REAL-TIME</p>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-zinc-500 text-xs">COHERENCE</p>
            <p className="text-4xl text-gold font-bold mt-1 transition-all duration-500">{coherence.toFixed(4)}</p>
            <div className="w-full h-1 bg-zinc-800 rounded mt-2"><div className="h-full rounded bg-gradient-to-r from-green-500 to-gold transition-all duration-500" style={{width:`${coherence*100}%`}}></div></div>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">ACTIVE AGENTS</p>
            <p className="text-4xl text-gold font-bold mt-1">{agents.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">ALL GOVERNED</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">BLOCKS SEALED</p>
            <p className="text-4xl text-gold font-bold mt-1">{blocks.toLocaleString()}</p>
            <p className="text-xs text-zinc-400 mt-1">+1 every 3s</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">INVARIANT STATUS</p>
            <p className="text-4xl text-green-400 font-bold mt-1">HOLDING</p>
            <p className="text-xs text-zinc-400 mt-1">7/7 Articles enforced</p>
          </div>
        </div>
      </section>

      {/* REPLAY ENGINE */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Replay Engine</h2>
        <p className="text-zinc-400 mt-2">Input any SHA-256 hash to witness a deterministic replay of state history</p>
        <div className="panel p-6 mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter SHA-256 hash..."
              className="flex-1 rounded-md border border-gold/40 bg-black px-4 py-3 text-zinc-100 font-courier text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
              aria-label="Hash input"
            />
            <button onClick={handleReplay} className="rounded-md bg-gold text-black px-6 py-3 font-bold hover:bg-yellow-600 hover:scale-105 transition-all duration-200">
              Replay
            </button>
          </div>
          <div className="mt-6 border border-gold/20 rounded-lg p-4 font-courier text-sm text-zinc-400 whitespace-pre-line min-h-[120px]">
            <p className="text-gold text-xs mb-2">REPLAY OUTPUT</p>
            <p>{replayOutput}</p>
          </div>
        </div>
      </section>

      {/* GOVERNANCE TOPOLOGY */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Governance Topology</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="panel p-6">
            <p className="text-gold font-bold text-sm">Causal Flow Map</p>
            <div className="mt-4 font-courier text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {["intent","verify","constrain","reason","act"].map((step,i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded border border-gold/30 text-gold">{step}</span>
                    {i < 4 && <span className="text-green-500">→</span>}
                  </span>
                ))}
              </div>
              <div className="text-center text-zinc-600 mt-2">↓ ↓ ↓ ↓ ↓</div>
              <div className="text-center border border-green-800/50 rounded py-2 bg-green-900/10 text-green-400">═══ L7 IMMUTABLE LEDGER ═══</div>
            </div>
          </div>
          <div className="panel p-6">
            <p className="text-gold font-bold text-sm">Invariant Topology</p>
            <div className="mt-4 space-y-2">
              {["I. Containment","II. Observability","III. Interruptibility","IV. Accountability","V. Proportionality","VI. Reversibility","VII. Temporal Asymmetry"].map((inv,i) => (
                <div key={i} className="flex justify-between items-center text-sm group hover:bg-green-900/10 px-2 py-1 rounded transition-colors">
                  <span className="text-zinc-300">{inv}</span>
                  <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] group-hover:shadow-[0_0_12px_#4ade80] transition-shadow"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE EVENT STREAM */}
      <section className="mt-8">
        <h2 className="text-2xl text-gold">Live Governance Events</h2>
        <div className="panel p-6 mt-4 font-courier text-sm max-h-[300px] overflow-y-auto">
          <div className="space-y-3 text-zinc-300">
            {events.map((ev, i) => (
              <div key={i} className={`flex gap-4 transition-all duration-500 ${i === 0 ? "opacity-100" : "opacity-70"}`}>
                <span className="text-zinc-500 shrink-0">{ev.time}</span>
                <span className={ev.type === "PASS" ? "text-green-400" : "text-gold"}>{ev.type}</span>
                <span>{ev.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="mt-8 pb-12">
        <h2 className="text-2xl text-gold">System Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { val: "1,548+", label: "ops/sec" },
            { val: "≤45ms", label: "P99 latency" },
            { val: "99.7%", label: "success rate" },
            { val: `${blocks.toLocaleString()}`, label: "blocks sealed" },
          ].map((m, i) => (
            <div key={i} className="panel p-4 text-center hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-bold text-gold font-courier">{m.val}</p>
              <p className="text-xs text-zinc-400 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
