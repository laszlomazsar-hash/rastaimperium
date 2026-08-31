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
  {
    title: "The Sacred Blueprint",
    pages: "17 pages",
    badge: "EVO",
    desc: "Declassifying the EVO Architecture — constitutional physics, Darwin Kernel, and the physics of AI containment.",
    href: "https://drive.google.com/file/d/17tKDmsxlj0AKdtbvCMfZwjiJeLZqAKzV/view?usp=drivesdk",
    accent: "gold",
  },
  {
    title: "Genetic Blueprint of Sovereign AI",
    pages: "20 pages",
    badge: "Lineage",
    desc: "Phylogenetic map from ARK Evolution & Omega roots through EVO-V to commercial EVO-G deployment.",
    href: "https://drive.google.com/file/d/1sfRPti0RY4QQULGDJXHHE3U46X-JZ6n-/view?usp=drivesdk",
    accent: "green",
  },
  {
    title: "EVO-V Sovereign Intelligence",
    pages: "17 pages",
    badge: "v2.0",
    desc: "Production-ready deterministic governance and verifiable containment for the age of autonomous systems.",
    href: "https://drive.google.com/file/d/1IWfMr2TE3JIscDRSY6jie8py2gCFFg7e/view?usp=drivesdk",
    accent: "crystal",
  },
  {
    title: "EVO-G Operational Assurance",
    pages: "10 pages",
    badge: "Public",
    desc: "Trusted automation for public sector — control gap closed, deterministic gatekeeping for HMRC, NHS, and councils.",
    href: "https://drive.google.com/file/d/1CWncp6LIobmEcygPNNDPmj5B8_nC2fvC/view?usp=drivesdk",
    accent: "green",
  },
];
