"use client";

import { useEffect, useState } from "react";

export interface GovernanceLayer {
  layer: number;
  name: string;
  description: string;
}

export interface CodexArticle {
  article: string;
  title: string;
  description: string;
  templateType?: string;
  governanceTheme?: string;
  linksTo?: string[];
  revisionHistory?: {
    version: string;
    updatedAt: string;
    summary: string;
  }[];
}

export interface ConsultingFeature {
  name: string;
  price: number;
  features?: string[];
  duration?: string;
}

export interface StripePlan {
  name: string;
  price: number;
  recurring: string;
}

export interface Dashboard {
  name: string;
  type: string;
  path: string;
}

export interface EnterpriseConfig {
  workspaces: boolean;
  subscriptionGated: boolean;
  usageBilling: {
    tokens: boolean;
    apiCalls: boolean;
    seats: boolean;
  };
  workspaceModel: {
    isolation: string;
    roleMatrix: string[];
    seatAllocation: {
      tier: string;
      includedSeats: number;
      extraSeatPrice: number;
    }[];
  };
  alerts: boolean;
  complianceTracking: boolean;
}


export interface AdminConfig {
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
}

export interface Telemetry {
  governance: {
    articleIITraceCoverage: number;
    articleIVSha256Verification: boolean;
    articleIIIDrills: string;
    articleVInterruptibility: string;
  };
  globalLayerMetrics: {
    layer: number;
    coherence: number;
    deviationAlert: string;
  }[];
  consultingVisibility: {
    enabled: boolean;
    reportCadence: string;
    linkedDashboards: string[];
  };
}

export interface Blueprint {
  version: string;
  title: string;
  description: string;
  website: {
    domain: string;
    pages: { path: string; title: string; component: string }[];
    nav: { label: string; href: string }[];
  };
  governanceStack: GovernanceLayer[];
  codex: CodexArticle[];
  consulting: {
    flagship: ConsultingFeature;
    midTier: ConsultingFeature[];
    workshops: ConsultingFeature[];
  };
  platform: {
    dashboards: Dashboard[];
    realtimeMetrics: {
      enabled: boolean;
      transport: string;
      publicDemoAccess: boolean;
    };
    layerCoherenceScores: {
      layer: number;
      name: string;
      score: number;
    }[];
    mutationLog: {
      id: string;
      event: string;
      actor: string;
      timestamp: string;
      status: string;
    }[];
    documentationFactory: boolean;
    evoVConcepts: boolean;
    branding: {
      rastaVibration: boolean;
      jahConsciousness: boolean;
    };
  };
  enterprise: EnterpriseConfig;
  stripe: {
    integration: boolean;
    checkout: boolean;
    subscriptionPlans: StripePlan[];
    usageBillingMeters: string[];
    featureAccess: {
      dashboardWidgets: boolean;
      codexTemplates: boolean;
    };
    webhookHandler: string;
    receipts: boolean;
    customerPortal: boolean;
    productionReadiness: {
      webhookToDbSync: boolean;
      emailReceiptChain: boolean;
      customerPortalLive: boolean;
    };
  };
  telemetry: Telemetry;
  admin: AdminConfig;
  technicalArchitecture: Record<string, unknown>;
  revenueModel: Record<string, unknown>;
  strategicPositioning: Record<string, unknown>;
  productionReadiness: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isBlueprint(value: unknown): value is Blueprint {
  if (!isRecord(value)) return false;

  const platform = value.platform;
  const stripe = value.stripe;
  const telemetry = value.telemetry;
  const enterprise = value.enterprise;
  const admin = value.admin;

  if (!isRecord(platform) || !isRecord(stripe) || !isRecord(telemetry) || !isRecord(enterprise) || !isRecord(admin)) {
    return false;
  }

  if (!isRecord(platform.realtimeMetrics) || !Array.isArray(platform.layerCoherenceScores) || !Array.isArray(platform.mutationLog)) {
    return false;
  }

  if (!Array.isArray(stripe.subscriptionPlans) || !isStringArray(stripe.usageBillingMeters) || !isRecord(stripe.featureAccess) || !isRecord(stripe.productionReadiness)) {
    return false;
  }

  if (!isRecord(telemetry.governance) || !Array.isArray(telemetry.globalLayerMetrics) || !isRecord(telemetry.consultingVisibility)) {
    return false;
  }

  if (!isRecord(enterprise.workspaceModel) || !Array.isArray(enterprise.workspaceModel.seatAllocation)) {
    return false;
  }

  if (!isRecord(admin.controls) || !isRecord(admin.deploymentControls)) {
    return false;
  }

  const governance = telemetry.governance;
  const consultingVisibility = telemetry.consultingVisibility;
  const workspaceModel = enterprise.workspaceModel;

  return (
    isString(value.version) &&
    isString(value.title) &&
    isRecord(value.website) &&
    Array.isArray(value.governanceStack) &&
    Array.isArray(value.codex) &&
    isRecord(value.consulting) &&
    isBoolean(platform.realtimeMetrics.enabled) &&
    isString(platform.realtimeMetrics.transport) &&
    isBoolean(platform.realtimeMetrics.publicDemoAccess) &&
    isBoolean(stripe.featureAccess.dashboardWidgets) &&
    isBoolean(stripe.featureAccess.codexTemplates) &&
    isBoolean(stripe.productionReadiness.webhookToDbSync) &&
    isBoolean(stripe.productionReadiness.emailReceiptChain) &&
    isBoolean(stripe.productionReadiness.customerPortalLive) &&
    isNumber(governance.articleIITraceCoverage) &&
    isBoolean(governance.articleIVSha256Verification) &&
    isString(governance.articleIIIDrills) &&
    isString(governance.articleVInterruptibility) &&
    isString(consultingVisibility.reportCadence) &&
    isStringArray(consultingVisibility.linkedDashboards) &&
    isString(workspaceModel.isolation) &&
    isStringArray(workspaceModel.roleMatrix) &&
    isBoolean(admin.controls.dashboards) &&
    isBoolean(admin.controls.subscriptionTiers) &&
    isBoolean(admin.controls.codexUpdates) &&
    isBoolean(admin.auditLogs) &&
    isBoolean(admin.deploymentControls.v35Triggers) &&
    isBoolean(admin.deploymentControls.rollback)
  );
}

function parseBlueprint(value: unknown): Blueprint {
  if (!isBlueprint(value)) {
    throw new Error("Invalid blueprint payload shape");
  }

  return value;
}

export function useBlueprint() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadBlueprint() {
      try {
        const response = await fetch("/config/blueprint-v3.5.json");

        if (!response.ok) {
          throw new Error("Failed to fetch blueprint");
        }

        const data = parseBlueprint(await response.json());
        if (mounted) {
          setBlueprint(data);
        }
      } catch (error) {
        console.error("Error loading blueprint:", error);
        if (mounted) {
          setBlueprint(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBlueprint();

    return () => {
      mounted = false;
    };
  }, []);

  return { blueprint, loading };
}
