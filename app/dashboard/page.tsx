"use client";

import { useEffect, useMemo, useState } from "react";

import { AlertWidget } from "../components/AlertWidget";
import { CoherenceMeter } from "../components/CoherenceMeter";
import { CodexCompliance } from "../components/CodexCompliance";
import { useBlueprint } from "../../hooks/useBlueprint";

type LayerMetric = { layer: number; coherence: number };

type StreamPayload = {
  livityScore: number;
  vibrationScore: number;
  mutationEvent: string;
  layers: LayerMetric[];
};

function nextPayload(seed: number): StreamPayload {
  const layers = Array.from({ length: 9 }, (_, idx) => {
    const layer = idx + 1;
    const baseline = 92 + ((seed + layer) % 6);
    return { layer, coherence: Math.min(100, baseline + (layer % 2 === 0 ? 0.4 : -0.4)) };
  });

  const livityScore = Number((layers.reduce((acc, item) => acc + item.coherence, 0) / layers.length).toFixed(2));
  const vibrationScore = Number((livityScore + ((seed % 5) - 2) * 0.5).toFixed(2));

  return {
    livityScore,
    vibrationScore,
    mutationEvent: `EVO-V mutation event #${seed}`,
    layers,
  };
}

export default function Dashboard() {
  const { blueprint, loading } = useBlueprint();
  const [tick, setTick] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setTick((current) => current + 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const stream = useMemo(() => nextPayload(tick), [tick]);
  const alerts = stream.layers.filter((layer) => layer.coherence < 90).map((layer) => `Layer L${layer.layer} fell to ${layer.coherence}%`);

  if (loading) return <p>Loading Dashboard...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>🌐 SoulEcho Dashboard</h1>
      <p>Real-time governance metrics with subscription-gated and enterprise widgets.</p>

      <CoherenceMeter score={stream.livityScore} />

      <section>
        <h3>Real-Time Stream</h3>
        <p>Vibration: {stream.vibrationScore}%</p>
        <p>Livity: {stream.livityScore}%</p>
        <p>Mutation Log: {stream.mutationEvent}</p>
      </section>

      <section>
        <h3>Subscription-Gated Widgets</h3>
        <ul>
          <li>Codex templates access: {blueprint.enterprise.subscriptionGated ? "Enabled" : "Locked"}</li>
          <li>
            Enterprise client metrics: {blueprint.enterprise.workspaces ? "Enabled (workspace mode)" : "Locked"}
          </li>
        </ul>
      </section>

      <CodexCompliance
        coverage={stream.layers.map((layer) => ({ layer: `L${layer.layer}`, coverage: Number(layer.coherence.toFixed(2)) }))}
      />
      <AlertWidget alerts={alerts} />
    </main>
  );
}
