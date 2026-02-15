"use client";

import { useEffect, useState } from "react";

type Blueprint = {
  version: string;
  title: string;
  description: string;
  website: {
    domain: string;
    pages: { path: string; title: string; component: string }[];
    nav: { label: string; href: string }[];
  };
  governanceStack: { layer: number; name: string; description: string }[];
  codex: {
    article: string;
    title: string;
    description: string;
    linksTo?: string[];
    templateType?: string;
    revisionHistory?: { version: string; updatedAt: string; summary: string }[];
  }[];
  consulting: {
    flagship: { name: string; price: number; features?: string[]; duration?: string };
    midTier?: { name: string; price: number; features?: string[]; duration?: string }[];
    workshops?: { name: string; price: number; features?: string[]; duration?: string }[];
  };
  stripe: {
    subscriptionPlans: { name: string; price: number; recurring: string }[];
    checkout?: boolean;
    webhookHandler?: string;
    receipts?: boolean;
    customerPortal?: boolean;
    usageBillingMeters?: string[];
    featureAccess?: {
      dashboardWidgets: boolean;
      codexTemplates: boolean;
    };
    productionReadiness?: {
      webhookToDbSync: boolean;
      emailReceiptChain: boolean;
      customerPortalLive: boolean;
    };
  };
  platform: {
    dashboards: { name: string; type: string; path: string }[];
    realtimeMetrics?: {
      enabled: boolean;
      transport: string;
      publicDemoAccess: boolean;
    };
    layerCoherenceScores?: { layer: number; name: string; score: number }[];
    mutationLog?: { id: string; event: string; actor: string; timestamp: string; status: string }[];
  };
  enterprise: {
    workspaces: boolean;
    subscriptionGated: boolean;
    usageBilling: { tokens: boolean; apiCalls: boolean; seats: boolean };
    workspaceModel?: {
      isolation: string;
      roleMatrix: string[];
      seatAllocation: { tier: string; includedSeats: number; extraSeatPrice: number }[];
    };
  };
  telemetry?: {
    governance: {
      articleIITraceCoverage: number;
      articleIVSha256Verification: boolean;
      articleIIIDrills: string;
      articleVInterruptibility: string;
    };
    globalLayerMetrics: { layer: number; coherence: number; deviationAlert: string }[];
    consultingVisibility: {
      enabled: boolean;
      reportCadence: string;
      linkedDashboards: string[];
    };
  };
  admin?: {
    controls: {
      dashboards: boolean;
      subscriptionTiers: boolean;
      codexUpdates: boolean;
    };
    auditLogs: boolean;
    deploymentControls: {
      v35Triggers: boolean;
      rollback: boolean;
    };
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
