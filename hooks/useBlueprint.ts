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
  alerts: boolean;
  complianceTracking: boolean;
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
    webhookHandler: string;
    receipts: boolean;
    customerPortal: boolean;
  };
  technicalArchitecture: Record<string, unknown>;
  revenueModel: Record<string, unknown>;
  strategicPositioning: Record<string, unknown>;
  productionReadiness: Record<string, unknown>;
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

        const data = (await response.json()) as Blueprint;
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
