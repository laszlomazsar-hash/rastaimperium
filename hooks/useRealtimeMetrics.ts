"use client";

import { useEffect, useState } from "react";

type RealtimeMetric = {
  activeUsers: number;
  websocketLatencyMs: number;
  coherence: number;
  alerts: string[];
  updatedAt: string;
};

const initialMetric: RealtimeMetric = {
  activeUsers: 18,
  websocketLatencyMs: 64,
  coherence: 97.2,
  alerts: ["No active deviations"],
  updatedAt: new Date().toISOString(),
};

export function useRealtimeMetrics() {
  const [metric, setMetric] = useState<RealtimeMetric>(initialMetric);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetric((previous) => {
        const coherence = Number((96 + Math.random() * 3).toFixed(2));
        const latency = Math.max(20, Math.round(50 + Math.random() * 60));
        const users = Math.max(1, previous.activeUsers + Math.round(Math.random() * 4 - 2));
        const alerts = coherence < 96.4 ? ["Layer deviation detected — review trace"] : ["No active deviations"];

        return {
          activeUsers: users,
          websocketLatencyMs: latency,
          coherence,
          alerts,
          updatedAt: new Date().toISOString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metric;
}
