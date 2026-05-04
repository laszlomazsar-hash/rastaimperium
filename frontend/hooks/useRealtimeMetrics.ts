"use client";

import { useEffect, useState } from "react";

export type RealtimeAlert = {
  id: string;
  message: string;
  severity: "ok" | "warn" | "error";
  source: "coherence-monitor" | "operator" | "system";
  createdAt: string;
};

export interface RealtimeMetricsSnapshot {
  activeUsers: number;
  websocketLatencyMs: number;
  coherence: number;
  alerts: string[];
  alertFeed: RealtimeAlert[];
  coherenceHistory: number[];
  updatedAt: string;
}

const initialMetric: RealtimeMetricsSnapshot = {
  activeUsers: 18,
  websocketLatencyMs: 64,
  coherence: 97.2,
  alerts: ["No active deviations"],
  alertFeed: [],
  coherenceHistory: [96.8, 97.0, 97.1, 97.2],
  updatedAt: new Date().toISOString(),
};

/**
 * Temporary adapter until realtime WebSocket / API integration lands.
 * Keeps a stable interface expected by dashboard presentation components.
 */
export function useRealtimeMetrics(): RealtimeMetricsSnapshot {
  const [metric, setMetric] = useState<RealtimeMetricsSnapshot>(initialMetric);

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
          alertFeed:
            coherence < 96.4
              ? [
                  {
                    id: `${Date.now()}`,
                    message: "Layer deviation detected — review trace",
                    severity: "warn",
                    source: "coherence-monitor",
                    createdAt: new Date().toISOString(),
                  },
                ]
              : [],
          coherenceHistory: [...previous.coherenceHistory.slice(-11), coherence],
          updatedAt: new Date().toISOString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metric;
}
