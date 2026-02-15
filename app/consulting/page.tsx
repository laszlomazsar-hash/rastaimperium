"use client";

import { useBlueprint } from "../../hooks/useBlueprint";

const enterpriseCtas = [
  {
    title: "Discovery Call",
    description: "Align business objectives, compliance requirements, and stakeholder ownership.",
    href: "/enterprise/intake?track=discovery",
  },
  {
    title: "AI Diagnostics",
    description: "Receive an executive-level readiness review across governance, controls, and delivery.",
    href: "/enterprise/intake?track=diagnostic",
  },
  {
    title: "Proposal Request",
    description: "Start a scoped commercial proposal tied to outcomes, risk posture, and timeline.",
    href: "/enterprise/intake?track=proposal",
  },
];

const proofCards = [
  {
    heading: "Case Study: Regulated Enterprise",
    text: "Implemented policy-backed AI delivery with audit-ready controls across three business units.",
  },
  {
    heading: "Governance Outcome",
    text: "Created a decision framework linking executive approvals, model risk tiers, and launch gates.",
  },
  {
    heading: "Compliance Positioning",
    text: "Mapped delivery controls to SOC 2, ISO 27001, and internal legal review workflows.",
  },
];

export default function ConsultingPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Rasta Imperium Blueprint...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  const { flagship, midTier = [], workshops = [] } = blueprint.consulting;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Consulting & Workshops</h1>
      <p>{blueprint.description}</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Enterprise Acquisition Path</h2>
        <p>
          For enterprise buyers, move directly into our structured funnel for discovery, diagnostics,
          and proposal planning.
        </p>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {enterpriseCtas.map((cta) => (
            <a key={cta.title} href={cta.href} style={{ border: "1px solid #d0d0d0", borderRadius: "10px", padding: "1rem", textDecoration: "none" }}>
              <h3>{cta.title}</h3>
              <p>{cta.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Proof & Trust Signals</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {proofCards.map((card) => (
            <article key={card.heading} style={{ border: "1px solid #d0d0d0", borderRadius: "10px", padding: "1rem" }}>
              <h3>{card.heading}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Flagship Service</h2>
        <h3>
          {flagship.name} (£{flagship.price})
        </h3>
        {Array.isArray(flagship.features) && flagship.features.length > 0 && (
          <ul>
            {flagship.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Mid-Tier Services</h2>
        <ul>
          {midTier.map((service) => (
            <li key={service.name}>
              <strong>{service.name}</strong> — £{service.price}
              {Array.isArray(service.features) && service.features.length > 0 && (
                <ul>
                  {service.features.map((feature) => (
                    <li key={`${service.name}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              )}
              {service.duration && <p>Duration: {service.duration}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Workshops</h2>
        <ul>
          {workshops.map((workshop) => (
            <li key={workshop.name}>
              <strong>{workshop.name}</strong> — £{workshop.price}
              {workshop.duration && <span> ({workshop.duration})</span>}
              {Array.isArray(workshop.features) && workshop.features.length > 0 && (
                <ul>
                  {workshop.features.map((feature) => (
                    <li key={`${workshop.name}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Approved Sales Collateral</h2>
        <p>Need the latest one-pager, pricing matrix, deck narrative, or objection notes?</p>
        <p>
          <a href="/sales-assets">Open the sales assets hub</a>
        </p>
      </section>
    </main>
  );
}
