"use client";

import { useEffect, useState } from "react";
import { generateTelemetrySnapshot, telemetryStatusLabel } from "../motion/telemetry";

export default function ObservatoryClient() {
  const [tick, setTick] = useState(0);
  const telemetry = generateTelemetrySnapshot(tick, "observatory-demo");

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-amber-800/60 bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200/90">
          DEMONSTRATION
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
          Local PRNG · not LIVE · not production monitoring
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["coherence", telemetry.coherence],
            ["drift", telemetry.drift],
            ["agents (synth)", String(telemetry.agents)],
            ["block", String(telemetry.block)],
            ["hash", telemetry.hash],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-black/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-2 font-mono text-xl text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
        <p className="font-mono text-xs text-zinc-500">
          STATUS · {telemetryStatusLabel(telemetry.systemState)} · tick {tick}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Seed · observatory-demo
        </p>
      </div>
    </div>
  );
}
