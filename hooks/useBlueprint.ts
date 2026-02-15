"use client";

import { useEffect, useState } from "react";

type Blueprint = {
  title: string;
  description: string;
  website: {
    domain: string;
    pages: { path: string; title: string; component: string }[];
    nav: { label: string; href: string }[];
  };
  governanceStack: { layer: number; name: string; description: string }[];
  codex: { article: string; title: string; description: string }[];
  consulting: {
    flagship: { name: string; price: number; features: string[] };
    midTier: { name: string; price: number; features?: string[] }[];
    workshops: { name: string; price: number; duration: string }[];
  };
  stripe: {
    subscriptionPlans: { name: string; price: number; recurring: string }[];
  };
  platform: {
    dashboards: { name: string; type: string; path: string }[];
  };
  enterprise: {
    workspaces: boolean;
    subscriptionGated: boolean;
    usageBilling: { tokens: boolean; apiCalls: boolean; seats: boolean };
  };
  productionReadiness?: {
    complete?: boolean;
    deployCommands?: string[];
    metricsDay1?: {
      traffic?: string;
      consultingLeads?: number;
      dashboardConnections?: number;
      codexDownloads?: number;
      workshopSeats?: number;
      coherence?: string;
    };
  };
};

export function useBlueprint() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadBlueprint = async () => {
      try {
        const response = await fetch("/config/blueprint-v3.5.json");
        if (!response.ok) {
          throw new Error("Unable to load blueprint configuration");
        }

        const data = (await response.json()) as Blueprint;
        if (active) {
          setBlueprint(data);
        }
      } catch {
        if (active) {
          setBlueprint(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlueprint();

    return () => {
      active = false;
    };
  }, []);

  return { blueprint, loading };
}
