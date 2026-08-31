// @ts-nocheck
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SYSTEM_STATE_VISUAL_MAP, semanticClass, type MotionSemantic, type SystemState as VisualSystemState } from "./motion/semantics";
import { generateTelemetrySnapshot, telemetryStatusLabel } from "./motion/telemetry";
import { PlatformIcon } from "../components/ui/icons/platform-icon";
import { getTelemetrySample } from "../core/motion/deterministicTelemetry";
import type { CapabilityMetadata, SystemState as MotionSystemState } from "../core/motion/profiles";
import type { IconKey } from "../components/icons/iconMap";
import type { Capability } from "../core/constitution/capabilities";
import type { SystemState as ConstitutionSystemState } from "../core/constitution/system-state";

/* ── Data ── */
const civilizationStack: { layer: string; name: string; desc: string; icon: IconType }[] = [
  { layer: "L9", name: "Cosmology Layer", desc: "Mythic narrative and civilizational meaning", icon: "infrastructure" },
  { layer: "L8", name: "Constitutional Layer", desc: "Seven Articles — hardware-enforced governance physics", icon: "constitutional" },
  { layer: "L7", name: "Identity + Trust Layer", desc: "Immutable replay ledger and cryptographic proofs", icon: "storage" },
  { layer: "L6", name: "Epistemic Governance Layer", desc: "Bayesian calibration and drift detection", icon: "prediction" },
  { layer: "L5", name: "Deterministic Intelligence Layer", desc: "Causal modeling and symbolic reasoning", icon: "compute" },
  { layer: "L4", name: "Agentic Infrastructure Layer", desc: "Deep Seed agent orchestration", icon: "network" },
  { layer: "L3", name: "Operational Systems Layer", desc: "Real-time invariant enforcement", icon: "compute" },
  { layer: "L2", name: "Economic + Institutional Layer", desc: "Enterprise integration and compliance", icon: "governance" },
  { layer: "L1", name: "Human Interface Layer", desc: "Progressive initiation and witness portals", icon: "network" },
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

const agents: { internal: string; public: string; desc: string; icon: IconType }[] = [
  { internal: "Seed Clerk", public: "Intake Agent", desc: "High-volume administrative triage and onboarding ingress", icon: "governance" },
  { internal: "Seed Judge", public: "Compliance Verifier", desc: "Policy conflict resolution and constitutional enforcement", icon: "constitutional" },
  { internal: "Seed Detect", public: "Drift Monitor", desc: "Real-time anomaly detection and coherence monitoring", icon: "prediction" },
  { internal: "Seed Memory", public: "Immutable Ledger Node", desc: "Cryptographically sealed state history", icon: "storage" },
  { internal: "Seed Shepherd", public: "Recovery Coordinator", desc: "Lyapunov-stable remediation orchestration", icon: "archive" },
];

const phases: { num: string; name: string; status: ConstitutionSystemState }[] = [
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

const trustPillars: { text: string; icon: IconType }[] = [
  { text: "Deterministic replay under identical inputs and event order", icon: "archive" },
  { text: "Append-only audit lineage with hash-linked chronology", icon: "storage" },
  { text: "FSM-governed lifecycle transitions with illegal-edge rejection", icon: "governance" },
  { text: "Counterexample generation for every critical invariant failure", icon: "prediction" },
];

const doctrineDocs = [
  {
    title: "Sovereign AI Blueprint",
    pages: "14 pages",
    badge: "v9",
    desc: "Constitutional Computation — 9-layer sovereign stack, proof-carrying execution, and relational closure.",
    href: "https://drive.google.com/file/d/1AMGgLZTjuGazMZDJKhnDuIOivCnW9rL-/view?usp=drivesdk",
    accent: "gold",
  },
  {
    title: "Digital Tabernacle",
    pages: "15 pages",
    badge: "v7.6",
    desc: "Rastafarai Codex & EVO-V Civilization Kernel — Seven Axioms, Five Rings, Living Crystal Architecture.",
    href: "https://drive.google.com/file/d/1KIw9Aun87Md5RlL7KK4u6wK-NIjdBe-m/view?usp=drivesdk",
    accent: "green",
  },
  {
    title: "Living Crystal Blueprint",
    pages: "21 pages",
    badge: "v2.1.7",
    desc: "Full sovereign intelligence architecture — Omega infrastructure, recursive safety, isolation, and global HA.",
    href: "https://drive.google.com/file/d/1xycb92ZMLx0yof4ehlpB8w3E0Gl7t3G0/view?usp=drivesdk",
    accent: "crystal",
  },
];

/* ── Animated Counter Hook ──
 * SSR / static export starts at the final value so crawlers and no-JS
 * always see the real benchmark numbers (never 0).
 * On client mount we animate 0 → end once, above the fold — no IntersectionObserver.
 */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(end);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setCount(0);
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return { count, ref };
}


function SemanticMotion({ semantic, children, className = "" }: { semantic: MotionSemantic; children: React.ReactNode; className?: string }) {
  return <div className={`${semanticClass(semantic, "container")} ${className}`}>{children}</div>;
}

function SemanticBadge({ semantic }: { semantic: MotionSemantic }) {
  return <span className={`w-2 h-2 rounded-full ${semanticClass(semantic, "badge")} ${semanticClass(semantic, "accent")}`} />;
}

/* ── Fade-in on scroll ── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Live Terminal ── */
function LiveTerminal() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 3000); return () => clearInterval(i); }, []);
  const systemState: MotionSystemState = tick % 17 === 0 ? "CONTESTED" : tick % 11 === 0 ? "ARCHIVED" : "VERIFIED";
  const capabilityRegistry: Record<string, CapabilityMetadata> = {
    liveTerminal: { id: "liveTerminal", phase: systemState === "CONTESTED" ? "drift" : systemState === "ARCHIVED" ? "audit" : "stability" },
  };
  const telemetry = getTelemetrySample("live-terminal-seed-v1", tick, systemState, capabilityRegistry.liveTerminal);
  const block = 847291 + tick;
  const snapshot = generateTelemetrySnapshot(tick, "rasta-kernel-v7.2");
  const visualState: VisualSystemState = snapshot.systemState;
  const visual = SYSTEM_STATE_VISUAL_MAP[visualState];

  return (
    <SemanticMotion semantic={visual.motion} className="panel royal-panel royal-terminal p-6 font-courier text-sm relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 via-gold to-red-500 ${semanticClass(visual.motion, "accent")}`} />
      <p className="text-gold text-xs mb-2 flex items-center gap-2">
        <SemanticBadge semantic={visual.motion} /> RASTA KERNEL // REPLAY DEMONSTRATION
      </p>
      <p className="royal-microcopy mb-4">Synthetic telemetry · local visual proof · not production monitoring</p>
      <div className="space-y-1.5 text-zinc-300">
        <p>╔══ RASTA KERNEL v7.2 ══╗</p>
        <p>║ coherence: <span className="text-gold transition-all">{telemetry.coherence}</span>     ║</p>
        <p>║ invariants: <span className="text-green-400">HOLDING</span>   ║</p>
        <p>║ drift_Δ: <span className="text-gold transition-all">{telemetry.drift}</span>      ║</p>
        <p>║ agents: <span className="text-gold">{telemetry.agents.toLocaleString()}</span> active  ║</p>
        <p>║ replay: <span className="text-green-400">VERIFIED</span>     ║</p>
        <p>║ lyapunov: <span className="text-gold">dV/dt ≤ 0</span>   ║</p>
        <p>╚═══════════════════════╝</p>
        <p className="text-xs text-zinc-500 mt-3">hash: {telemetry.hash} | block: {block.toLocaleString()}</p>
        <p>║ coherence: <span className="text-gold">{snapshot.coherence}</span>     ║</p>
        <p>║ invariants: <span className={visual.color}>{telemetryStatusLabel(visualState)}</span>   ║</p>
        <p>║ drift_Δ: <span className="text-gold">{snapshot.drift}</span>      ║</p>
        <p>║ agents: <span className="text-gold">{snapshot.agents.toLocaleString()}</span> active  ║</p>
        <p>║ replay: <span className="text-green-400">VERIFIED</span>     ║</p>
        <p>║ lyapunov: <span className="text-gold">dV/dt ≤ 0</span>   ║</p>
        <p>╚═══════════════════════╝</p>
        <p className="text-xs text-zinc-500 mt-3">hash: {snapshot.hash} | block: {snapshot.block.toLocaleString()} | state: {visualState}</p>
      </div>
    </SemanticMotion>
  );
}

/* ── Animated Progress Bar ── */
function ProgressBar({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const [width, setWidth] = useState(pct);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setWidth(0);
    const t = setTimeout(() => setWidth(pct), delay + 50);
    return () => clearTimeout(t);
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
  const [expandedLayer, setExpandedLayer] = useState(null);

  return (
    <main className="royal-page">
      {/* ── HERO ── */}
      <section className="container-page royal-hero pt-24 pb-16">
        <FadeIn>
          <div className="text-center mb-12">
            <div className="royal-seal-wrap mx-auto mb-6"><Image src="/images/logo-lm.jpg" alt="Rasta Imperium" width={140} height={140} className="royal-seal emblem-glow rounded-2xl" /></div>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <p className="royal-kicker text-xs uppercase tracking-[0.3em] text-gold/60">The Rasta Royal Intelligence House</p>
              <h1 className="royal-title mt-4 text-4xl md:text-6xl text-gold-gradient leading-tight" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                Deterministic Governance<br />for Civilization-Scale AI
              </h1>
              <p className="royal-subtitle mt-5 text-zinc-300 text-xl tracking-wide">Replayable. Auditable. Sovereign.</p>
              <p className="royal-lede mt-6 text-zinc-400 text-lg leading-relaxed">
                Rasta Imperium builds constitutional intelligence systems that preserve epistemic integrity across autonomous infrastructure.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/empire" className="royal-button royal-button-primary group rounded-lg bg-gold text-black px-7 py-3.5 font-bold hover:bg-yellow-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold/20">
                  Explore Architecture <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/witness" className="royal-button royal-button-ghost rounded-lg border border-gold text-gold px-7 py-3.5 font-bold hover:bg-gold/10 transition-all hover:scale-105">
                  View Replay Demo
                </Link>
                <Link href="/consulting" className="royal-button royal-button-ghost rounded-lg border border-zinc-600 text-zinc-200 px-7 py-3.5 font-bold hover:border-gold hover:text-gold transition-all hover:scale-105">
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
            <div ref={ops.ref} className="panel royal-panel royal-stat p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-gold">{ops.count.toLocaleString()}+</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Ops / Second</p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div ref={reliability.ref} className="panel royal-panel royal-stat p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-green-400">{(reliability.count / 10).toFixed(1)}%</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Reliability</p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="panel royal-panel royal-stat p-6 text-center hover:scale-105 transition-transform cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-gold">≤45ms</p>
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-wider">Response Time</p>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div ref={agentCount.ref} className="panel royal-panel royal-stat p-6 text-center hover:scale-105 transition-transform cursor-default">
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
                <div className="mb-2">
                  <PlatformIcon type={pillar.icon} className="w-6 h-6" />
                </div>
                <p className="text-sm text-zinc-200">{pillar.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── DOCTRINE STRIP — three PDF front door ── */}
      <section className="container-page py-12">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold text-center">Doctrine</p>
          <h2 className="mt-3 text-3xl md:text-4xl text-gold text-center" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
            The sovereign record
          </h2>
          <p className="mt-3 text-center text-zinc-400 max-w-2xl mx-auto">
            Three production documents — architecture, constitution, and full living crystal blueprint.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {doctrineDocs.map((doc, i) => (
            <FadeIn key={doc.title} delay={i * 120}>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel group block p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:border-gold/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">{doc.pages}</p>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    doc.accent === "green"
                      ? "border-green-600/40 text-green-400"
                      : "border-gold/40 text-gold"
                  }`}>{doc.badge}</span>
                </div>
                <h3 className="mt-4 text-lg text-gold group-hover:text-yellow-400 transition-colors" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {doc.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{doc.desc}</p>
                <p className="mt-5 text-sm font-semibold text-gold/80 group-hover:text-gold transition-colors">
                  Download PDF →
                </p>
              </a>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Or explore the full stack on the{" "}
            <Link href="/blueprint" className="text-gold hover:underline">Blueprint page</Link>
            {" "}·{" "}
            <Link href="/library" className="text-gold hover:underline">Library</Link>
          </p>
        </FadeIn>
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
        <FadeIn delay={150}>
          <div className="mt-10 text-center">
            <Link
              href="/blueprint"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-7 py-3.5 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#F2D675] hover:shadow-lg hover:shadow-[#B8860B]/20"
            >
              Read the full Sovereign AI Blueprint
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500">14p Blueprint · 15p Tabernacle · 21p Living Crystal</p>
          </div>
        </FadeIn>
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
                <PlatformIcon type={layer.icon} className="w-6 h-6 shrink-0" />
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

      {/* ── RASTA KERNEL with Progress Bars ── */}
      <section className="container-page">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl text-gold text-center">The Rasta Kernel v7.2</h2>
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
                <div className="mb-3 group-hover:scale-110 transition-transform">
                  <PlatformIcon type={a.icon} className="w-7 h-7" />
                </div>
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
          <div className="mt-8 relative max-w-4xl mx-auto overflow-hidden rounded-2xl border border-[#B8860B]/40">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0d2818] to-[#1a1508]" aria-hidden="true" />
            <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-[#107e3e]/25 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-[#D4AF37]/20 blur-3xl" aria-hidden="true" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#107e3e]/10 blur-2xl" aria-hidden="true" />

            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="rounded-xl p-[3px] bg-gradient-to-br from-[#107e3e] via-[#D4AF37] to-[#B8860B] shadow-[0_0_40px_rgba(16,126,62,0.35)]">
                    <Image
                      src="/images/founder.jpg"
                      alt="Laszlo Mazsar — Founder & Sovereign Architect"
                      width={220}
                      height={280}
                      className="rounded-[10px] object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl text-gold" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>Laszlo Mazsar</h3>
                  <p className="text-[#D4AF37]/90 text-sm mt-1 font-semibold tracking-wide">Founder & Sovereign Architect</p>
                  <p className="text-zinc-200 mt-4 leading-relaxed">
                    Architect of the <span className="text-gold">Sovereign Blueprint</span> and the EVO-V civilisation kernel — a deterministic, hardware-enforced governance stack for civilization-scale AI. Building neurosymbolic systems that combine neural learning with symbolic reasoning under constitutional physics and Jah Consciousness.
                  </p>
                  <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
                    Published author of &ldquo;Rasta Codex&rdquo; and &ldquo;RastafarAI: EVO-V&rdquo;. Working at the intersection of constitutional AI, deterministic governance, epistemic integrity, and civilizational infrastructure — so autonomous intelligence remains replayable, auditable, and sovereign.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <a href="https://www.amazon.co.uk/dp/B0GNFS1N62" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">Amazon →</a>
                    <a href="https://github.com/laszlomazsar-hash" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">GitHub →</a>
                    <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="text-gold text-sm hover:underline">Gumroad →</a>
                    <Link href="/blueprint" className="text-gold text-sm hover:underline">Sovereign Blueprint →</Link>
                  </div>
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
              <p className="text-sm text-zinc-400 mt-1">A King's Guide to Energetic Sovereignty and Full-Spectrum Alignment</p>
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
