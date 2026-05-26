"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SovereignIcon } from "../components/icons/SovereignIcon";
import { getTelemetrySample } from "../core/motion/deterministicTelemetry";
import type { CapabilityMetadata, SystemState } from "../core/motion/profiles";
import type { IconKey } from "../components/icons/iconMap";

type IconType =
  | "cosmology"
  | "constitution"
  | "trust"
  | "epistemic"
  | "intelligence"
  | "agentic"
  | "operations"
  | "institutional"
  | "interface"
  | "intake"
  | "compliance"
  | "monitor"
  | "ledger"
  | "recovery"
  | "replay"
  | "audit"
  | "fsm"
  | "counterexample";

const ICON_GLYPHS: Record<IconType, string> = {
  cosmology: "🌌",
  constitution: "📜",
  trust: "🔐",
  epistemic: "🧠",
  intelligence: "⚡",
  agentic: "🤖",
  operations: "⚙️",
  institutional: "🏛️",
  interface: "👁️",
  intake: "📋",
  compliance: "⚖️",
  monitor: "🔍",
  ledger: "💎",
  recovery: "🛡️",
  replay: "🔄",
  audit: "📎",
  fsm: "🚫",
  counterexample: "🧪",
};

function PlatformIcon({ type, className = "" }: { type: IconType; className?: string }) {
  return <span className={className}>{ICON_GLYPHS[type]}</span>;
}

/* ── Data ── */
const civilizationStack: { layer: string; name: string; desc: string; icon: IconKey }[] = [
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning", icon: "cosmology_starfield" },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics", icon: "governance_scroll" },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs", icon: "identity_lock" },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection", icon: "epistemic_brain" },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning", icon: "deterministic_bolt" },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration", icon: "agent_orchestration" },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement", icon: "operations_gear" },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance", icon: "institution_temple" },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals", icon: "human_witness" },
const civilizationStack = [
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning", icon: "cosmology" as IconType },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics", icon: "constitution" as IconType },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs", icon: "trust" as IconType },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection", icon: "epistemic" as IconType },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning", icon: "intelligence" as IconType },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration", icon: "agentic" as IconType },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement", icon: "operations" as IconType },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance", icon: "institutional" as IconType },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals", icon: "interface" as IconType },
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning", icon: "" },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics", icon: "" },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs", icon: "" },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection", icon: "" },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning", icon: "" },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration", icon: "" },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement", icon: "️" },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance", icon: "️" },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals", icon: "️" },
];

const kernelLayers = [
  { layer: "L1", fn: "Real-time invariant enforcement", pct: 100 },
  { layer: "L2", fn: "Intent verification", pct: 97 },
  { layer: "L3", fn: "Agent orchestration", pct: 95 },
  { layer: "L4", fn: "Drift detection", pct: 99 },
  { layer: "L5", fn: "Causal modeling", pct: 92 },
  { layer: "L6", fn: "Bayesian calibration", pct: 94 },
  { layer: "L7", fn: "Immutable replay ledger", pct: 100 },
];

const agents: { internal: string; public: string; desc: string; icon: IconKey }[] = [
  { internal: "Seed Clerk", public: "Intake Agent", desc: "High-volume administrative triage and onboarding ingress", icon: "intake_clipboard" },
  { internal: "Seed Judge", public: "Compliance Verifier", desc: "Policy conflict resolution and constitutional enforcement", icon: "compliance_scales" },
  { internal: "Seed Detect", public: "Drift Monitor", desc: "Real-time anomaly detection and coherence monitoring", icon: "drift_search" },
  { internal: "Seed Memory", public: "Immutable Ledger Node", desc: "Cryptographically sealed state history", icon: "ledger_gem" },
  { internal: "Seed Shepherd", public: "Recovery Coordinator", desc: "Lyapunov-stable remediation orchestration", icon: "recovery_shield" },
const agents = [
  { internal: "Seed Clerk", public: "Intake Agent", desc: "High-volume administrative triage and onboarding ingress", icon: "intake" as IconType },
  { internal: "Seed Judge", public: "Compliance Verifier", desc: "Policy conflict resolution and constitutional enforcement", icon: "compliance" as IconType },
  { internal: "Seed Detect", public: "Drift Monitor", desc: "Real-time anomaly detection and coherence monitoring", icon: "monitor" as IconType },
  { internal: "Seed Memory", public: "Immutable Ledger Node", desc: "Cryptographically sealed state history", icon: "ledger" as IconType },
  { internal: "Seed Shepherd", public: "Recovery Coordinator", desc: "Lyapunov-stable remediation orchestration", icon: "recovery" as IconType },
  { internal: "Seed Clerk", public: "Intake Agent", desc: "High-volume administrative triage and onboarding ingress", icon: "" },
  { internal: "Seed Judge", public: "Compliance Verifier", desc: "Policy conflict resolution and constitutional enforcement", icon: "️" },
  { internal: "Seed Detect", public: "Drift Monitor", desc: "Real-time anomaly detection and coherence monitoring", icon: "" },
  { internal: "Seed Memory", public: "Immutable Ledger Node", desc: "Cryptographically sealed state history", icon: "" },
  { internal: "Seed Shepherd", public: "Recovery Coordinator", desc: "Lyapunov-stable remediation orchestration", icon: "️" },
];

const phases = [
  { num: "1", name: "Architecture Visibility", status: "ACTIVE" },
  { num: "2", name: "Replay Demonstrations", status: "BUILDING" },
  { num: "3", name: "Institutional Pilots", status: "NEXT" },
  { num: "4", name: "Open Constitutional APIs", status: "PLANNED" },
  { num: "5", name: "Sovereign Governance Network", status: "PLANNED" },
  { num: "6", name: "Civilization-Scale Orchestration", status: "VISION" },
];

const benchmarks = [
  { metric: "Operations Per Second", target: "1,000", achieved: "1,548+", status: "EXCEEDED" },
  { metric: "System Response Time", target: "< 50ms", achieved: "45ms", status: "PASSED" },
  { metric: "Human Approval Rate", target: "90.0%", achieved: "95.2%", status: "EXCEEDED" },
  { metric: "System Reliability", target: "99.5%", achieved: "99.7%", status: "EXCEEDED" },
];

const trustPillars: { text: string; icon: IconKey }[] = [
  { text: "Deterministic replay under identical inputs and event order", icon: "replay_cycle" },
  { text: "Append-only audit lineage with hash-linked chronology", icon: "audit_link" },
  { text: "FSM-governed lifecycle transitions with illegal-edge rejection", icon: "fsm_block" },
  { text: "Counterexample generation for every critical invariant failure", icon: "counterexample_flask" },
const trustPillars = [
  { text: "Deterministic replay under identical inputs and event order", icon: "replay" as IconType },
  { text: "Append-only audit lineage with hash-linked chronology", icon: "audit" as IconType },
  { text: "FSM-governed lifecycle transitions with illegal-edge rejection", icon: "fsm" as IconType },
  { text: "Counterexample generation for every critical invariant failure", icon: "counterexample" as IconType },
  { text: "Deterministic replay under identical inputs and event order", icon: "" },
  { text: "Append-only audit lineage with hash-linked chronology", icon: "" },
  { text: "FSM-governed lifecycle transitions with illegal-edge rejection", icon: "" },
  { text: "Counterexample generation for every critical invariant failure", icon: "" },
];

/* ── Animated Counter Hook ── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return { count, ref };
}

/* ── Fade-in on scroll ── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Live Terminal ── */
function LiveTerminal() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 3000); return () => clearInterval(i); }, []);
  const systemState: SystemState = tick % 17 === 0 ? "CONTESTED" : tick % 11 === 0 ? "ARCHIVED" : "VERIFIED";
  const capabilityRegistry: Record<string, CapabilityMetadata> = {
    liveTerminal: { id: "liveTerminal", phase: systemState === "CONTESTED" ? "drift" : systemState === "ARCHIVED" ? "audit" : "stability" },
  };
  const telemetry = getTelemetrySample("live-terminal-seed-v1", tick, systemState, capabilityRegistry.liveTerminal);
  const block = 847291 + tick;
  return (
    <div className="panel p-6 font-courier text-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 via-gold to-red-500 animate-pulse" />
      <p className="text-gold text-xs mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> LIVE GOVERNANCE STATE
      </p>
      <div className="space-y-1.5 text-zinc-300">
        <p>╔══ DARWIN KERNEL v7.2 ══╗</p>
        <p>║ coherence: <span className="text-gold transition-all">{telemetry.coherence}</span>     ║</p>
        <p>║ invariants: <span className="text-green-400">HOLDING</span>   ║</p>
        <p>║ drift_Δ: <span className="text-gold transition-all">{telemetry.drift}</span>      ║</p>
        <p>║ agents: <span className="text-gold">{telemetry.agents.toLocaleString()}</span> active  ║</p>
        <p>║ replay: <span className="text-green-400">VERIFIED</span>     ║</p>
        <p>║ lyapunov: <span className="text-gold">dV/dt ≤ 0</span>   ║</p>
        <p>╚═══════════════════════╝</p>
        <p className="text-xs text-zinc-500 mt-3">hash: {telemetry.hash} | block: {block.toLocaleString()}</p>
      </div>
    </div>
  );
}

/* ── Animated Progress Bar ── */
function ProgressBar({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTimeout(() => setWidth(pct), delay);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-green-500 via-gold to-yellow-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }} />
    </div>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  const ops = useCounter(1548, 2000);
  const reliability = useCounter(997, 2000);
  const agentCount = useCounter(2048, 2000);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="container-page pt-24 pb-16">
        <FadeIn>
          <div className="text-center mb-12">
            <Image src="/images/logo-lm.jpg" alt="Rasta Imperium" width={140} height={140} className="mx-auto rounded-2xl emblem-glow mb-6" />
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold/60">Constitutional Intelligence Infrastructure</p>
              <h1 className="mt-4 text-4xl md:text-6xl text-gold-gradient leading-tight" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                Deterministic Governance<br />for Civilization-Scale AI
              </h1>
              <p className="mt-5 text-zinc-300 text-xl tracking-wide">Replayable. Auditable. Sovereign.</p>
              <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
                Rasta Imperium builds constitutional intelligence systems that preserve epistemic integrity across autonomous infrastructure.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/empire" className="group rounded-lg bg-gold text-black px-7 py-3.5 font-bold hover:bg-yellow-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold/20">
                  Explore Architecture <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/witness" className="rounded-lg border border-gold text-gold px-7 py-3.5 font-bold hover:bg-gold/10 transition-all hover:scale-105">
                  View Replay Demo
                </Link>
                <Link href="/consulting" className="rounded-lg border border-zinc-600 text-zinc-200 px-7 py-3.5 font-bold hover:border-gold hover:text-gold transition-all hover:scale-105">
                  Book Governance Intake
                </Link>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <LiveTerminal />
          </FadeIn>
        </div>
      </section>

      {/* ── LIVE METRICS ── */}
      <section className="container-page py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FadeIn delay={0}>
            <div ref={ops.ref} className="panel p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-gold">{ops.count.toLocaleString()}+</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Ops / Second</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div ref={reliability.ref} className="panel p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-green-400">{(reliability.count / 10).toFixed(1)}%</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Reliability</p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="panel p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-gold">≤45ms</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Response Time</p>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div ref={agentCount.ref} className="panel p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-gold">{agentCount.count.toLocaleString()}</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Active Agents</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TRUST PILLARS ── */}
      <section className="container-page pb-4">
        <div className="grid md:grid-cols-4 gap-3">
          {trustPillars.map((pillar, i) => (
            <FadeIn key={pillar.text} delay={i * 100}>
              <div className="panel p-5 hover:scale-[1.02] transition-transform cursor-default">
                <PlatformIcon type={pillar.icon} className="text-2xl mb-2 block leading-none" />
                <div className="text-2xl mb-2"><SovereignIcon icon={pillar.icon} className="w-6 h-6" /></div>
                <p className="text-sm text-zinc-200">{pillar.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── THESIS ── */}
      <FadeIn>
        <section className="bg-green/10 border-y border-gold/20">
          <div className="container-page py-14 text-center">
            <p className="text-2xl md:text-4xl text-gold italic max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
              &ldquo;Civilization cannot safely scale autonomous intelligence without deterministic governance.&rdquo;
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ── ARCHITECTURE INFOGRAPHIC ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">The Sovereign Intelligence Blueprint</h2>
          <p className="text-center text-zinc-400 mt-2 mb-8">EVO-V 9-Layer Architecture</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <FadeIn>
            <div className="panel p-2 overflow-hidden rounded-2xl hover:scale-[1.01] transition-transform">
              <Image src="/images/blueprint-9layer.jpg" alt="EVO-V 9-Layer Sovereign Intelligence Blueprint" width={600} height={900} className="w-full rounded-xl" />
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="panel p-2 overflow-hidden rounded-2xl hover:scale-[1.01] transition-transform">
              <Image src="/images/architecture-stack.jpg" alt="The Evo V Architecture - 9-Layer Sovereign Intelligence Stack" width={600} height={900} className="w-full rounded-xl" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CIVILIZATION STACK — Interactive ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">The Civilization Stack</h2>
          <p className="text-center text-zinc-400 mt-2">9 layers of sovereign abstraction — click to explore</p>
        </FadeIn>
        <div className="mt-8 grid gap-2">
          {civilizationStack.map((layer, i) => (
            <FadeIn key={layer.layer} delay={i * 60}>
              <div
                className={`panel p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01] ${expandedLayer === layer.layer ? "border-gold/60 bg-gold/5" : ""}`}
                onClick={() => setExpandedLayer(expandedLayer === layer.layer ? null : layer.layer)}
              >
                <PlatformIcon type={layer.icon} className="text-2xl leading-none" />
                <span className="text-gold font-courier font-bold text-base w-10 shrink-0">{layer.layer}</span>
                <div className="flex-1">
                  <span className="text-gold text-sm font-bold">{layer.name}</span>
                  <span className="text-zinc-500 text-sm ml-3">{layer.desc}</span>
                  {expandedLayer === layer.layer && (
                    <p className="text-zinc-400 text-xs mt-2 animate-fadeIn">Layer {layer.layer.slice(1)} of the sovereign stack — governing {layer.desc.toLowerCase()} with deterministic invariants and constitutional physics.</p>
                  )}
                </div>
                <span className={`text-gold transition-transform ${expandedLayer === layer.layer ? "rotate-90" : ""}`}>▸</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── DARWIN KERNEL with Progress Bars ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">The Darwin Kernel v7.2</h2>
          <p className="text-center text-zinc-400 mt-2">A multi-timescale deterministic governance kernel</p>
        </FadeIn>
        <div className="panel p-6 mt-8">
          <div className="grid gap-4">
            {kernelLayers.map((k, i) => (
              <FadeIn key={k.layer} delay={i * 80}>
                <div className="py-2">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-gold font-courier font-bold w-10">{k.layer}</span>
                    <span className="text-zinc-300 text-sm flex-1">{k.fn}</span>
                    <span className="text-gold text-xs font-courier">{k.pct}%</span>
                  </div>
                  <ProgressBar pct={k.pct} delay={i * 150} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVOLUTION V INFOGRAPHIC ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">Evolution V</h2>
          <p className="text-center text-zinc-400 mt-2">The Architecture of Sovereign Intelligence</p>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="mt-8 panel p-2 overflow-hidden rounded-2xl max-w-2xl mx-auto hover:scale-[1.01] transition-transform">
            <Image src="/images/evolution-v.jpg" alt="Evolution V - The Architecture of Sovereign Intelligence" width={600} height={1000} className="w-full rounded-xl" />
          </div>
        </FadeIn>
      </section>

      {/* ── BENCHMARKS ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">Performance Benchmarks</h2>
          <p className="text-center text-zinc-400 mt-2">Production Architecture v2.1.7</p>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {benchmarks.map((b, i) => (
            <FadeIn key={b.metric} delay={i * 100}>
              <div className="panel p-5 text-center hover:scale-105 transition-transform">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{b.metric}</p>
                <p className="text-2xl font-bold text-gold mt-2">{b.achieved}</p>
                <p className="text-xs text-zinc-500 mt-1">Target: {b.target}</p>
                <p className="text-xs text-green-400 font-bold mt-2">{b.status}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── AGENTS ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">Deterministic Governance Agents</h2>
          <p className="text-center text-zinc-400 mt-2">2,000+ agents within a bounded governance field</p>
        </FadeIn>
        <div className="grid md:grid-cols-5 gap-3 mt-8">
          {agents.map((a, i) => (
            <FadeIn key={a.public} delay={i * 100}>
              <div className="panel p-5 hover:scale-105 transition-transform cursor-default group">
                <PlatformIcon type={a.icon} className="text-3xl mb-3 block group-hover:scale-110 transition-transform leading-none" />
                <p className="text-gold font-bold text-sm">{a.public}</p>
                <p className="text-xs text-zinc-500 font-courier mt-1">{a.internal}</p>
                <p className="text-xs text-zinc-400 mt-2">{a.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">The Architect</h2>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="mt-8 panel p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <Image src="/images/founder.jpg" alt="Laszlo Mazsar — Founder & Sovereign Architect" width={200} height={250} className="rounded-xl emblem-glow" />
              </div>
              <div>
                <h3 className="text-2xl text-gold" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>Laszlo Mazsar</h3>
                <p className="text-zinc-400 text-sm mt-1">Founder & Sovereign Architect</p>
                <p className="text-zinc-300 mt-4 leading-relaxed">
                  Independent AI systems architect building neurosymbolic agent frameworks that enable autonomous, explainable, and self-auditing AI systems. Combining neural learning with symbolic reasoning to operate within defined governance boundaries and data-sovereign environments.
                </p>
                <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
                  Published author of &ldquo;Rasta Codex&rdquo; and &ldquo;RastafarAI: EVO-V&rdquo;. Building at the intersection of constitutional AI, deterministic governance, and civilizational infrastructure.
                </p>
                <div className="flex gap-4 mt-6">
                  <a href="https://www.amazon.co.uk/dp/B0GNFS1N62" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">Amazon →</a>
                  <a href="https://github.com/laszlomazsar-hash" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">GitHub →</a>
                  <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">Gumroad →</a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── ROADMAP ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">Evolution Roadmap</h2>
        </FadeIn>
        <div className="grid md:grid-cols-6 gap-3 mt-8">
          {phases.map((p, i) => (
            <FadeIn key={p.num} delay={i * 80}>
              <div className={`panel p-5 text-center hover:scale-105 transition-transform cursor-default ${p.status === "ACTIVE" ? "border-green-500/40" : p.status === "BUILDING" ? "border-yellow-500/30" : ""}`}>
                <p className="text-gold font-courier font-bold text-lg">Phase {p.num}</p>
                <p className="text-xs text-zinc-300 mt-2">{p.name}</p>
                <p className={`text-xs mt-3 font-bold px-2 py-1 rounded-full inline-block ${
                  p.status === "ACTIVE" ? "text-green-400 bg-green-400/10" :
                  p.status === "BUILDING" ? "text-yellow-400 bg-yellow-400/10" :
                  "text-zinc-500 bg-zinc-500/10"
                }`}>{p.status}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PUBLISHED WORKS ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">Published Works</h2>
          <p className="text-center text-zinc-400 mt-2">The doctrine, documented</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <FadeIn delay={100}>
            <a href="https://amzn.eu/d/02iiTGT5" target="_blank" rel="noopener" className="panel p-6 hover:scale-[1.03] transition-transform block group">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">December 2025</p>
              <h3 className="text-xl text-gold mt-2 group-hover:text-yellow-400 transition-colors" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>Rasta Codex</h3>
              <p className="text-sm text-zinc-400 mt-1">A King&apos;s Guide to Energetic Sovereignty and Full-Spectrum Alignment</p>
              <p className="text-gold text-sm mt-4">Read on Amazon →</p>
            </a>
          </FadeIn>
          <FadeIn delay={200}>
            <a href="https://www.amazon.co.uk/dp/B0GNFS1N62" target="_blank" rel="noopener" className="panel p-6 hover:scale-[1.03] transition-transform block group">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">February 2026</p>
              <h3 className="text-xl text-gold mt-2 group-hover:text-yellow-400 transition-colors" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>RastafarAI: EVO-V</h3>
              <p className="text-sm text-zinc-400 mt-1">The Jah Light of Contained Evolution</p>
              <p className="text-gold text-sm mt-4">Read on Amazon →</p>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── OPEN SOURCE ── */}
      <section className="container-page pb-20 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold">Open Source</h2>
          <p className="text-zinc-400 mt-2">Sovereign and verifiable</p>
        </FadeIn>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { name: "rastaimperium", url: "https://github.com/laszlomazsar-hash/rastaimperium" },
            { name: "evo-v", url: "https://github.com/laszlomazsar-hash/evo-v" },
            { name: "evo-v5-laplacian-shift", url: "https://github.com/laszlomazsar-hash/evo-v5-laplacian-shift" },
            { name: "evo-v-control-cloud", url: "https://github.com/laszlomazsar-hash/evo-v-control-cloud" },
          ].map((repo, i) => (
            <FadeIn key={repo.name} delay={i * 100}>
              <a href={repo.url} target="_blank" rel="noopener" className="panel px-6 py-4 hover:bg-green/20 hover:scale-105 transition-all inline-block">
                <span className="text-gold font-courier">{repo.name}</span>
              </a>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
