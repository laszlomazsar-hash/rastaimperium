"use client";

import { useBlueprint } from "../../hooks/useBlueprint";

const enterpriseBenefits = [
  "Accelerate time-to-compliance with policy-aware AI workflows",
  "Reduce governance risk with enforceable guardrails and audit trails",
  "Increase observability across token usage, model behavior, and workspace controls",
];

const roleUseCases = [
  {
    role: "CTO / Head of AI Governance",
    outcomes: ["Blueprint-aligned AI strategy", "Cross-workspace oversight", "Board-ready reporting"],
  },
  {
    role: "Compliance / Risk Leads",
    outcomes: ["Policy mapping against Patrol Articles I–VII", "Continuous audit evidence", "Data residency controls"],
  },
  {
    role: "Engineering Leadership",
    outcomes: ["Guardrails in delivery pipelines", "Telemetry for incidents and quality", "Lower rework and escalation costs"],
  },
];

const faqs = [
  {
    question: "How do you handle enterprise security and compliance requirements?",
    answer:
      "We implement controls for governance policy enforcement, evidence retention, and model interaction monitoring with auditable reporting.",
  },
  {
    question: "Can you support data residency and isolated enterprise workspaces?",
    answer:
      "Yes. Workspace isolation, scoped permissions, and regional data handling options can be configured for enterprise requirements.",
  },
  {
    question: "What SLAs do you provide for enterprise engagements?",
    answer:
      "Enterprise programs include defined reporting cadence, response commitments, and delivery governance with executive checkpoints.",
  },
];

export default function ConsultingPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Rasta Imperium Blueprint...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  const { flagship, midTier = [], workshops = [] } = blueprint.consulting;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <section style={{ marginBottom: "2.5rem" }}>
        <p style={{ textTransform: "uppercase", fontWeight: 700, color: "#0f766e" }}>Enterprise AI Governance</p>
        <h1 style={{ marginBottom: "0.75rem" }}>Launch compliant AI systems faster with measurable enterprise outcomes.</h1>
        <p style={{ marginBottom: "1rem", lineHeight: 1.5 }}>
          Move from fragmented experimentation to board-ready AI governance in weeks, with consulting, telemetry, and policy frameworks
          designed for regulated enterprise teams.
        </p>
        <button
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.1rem",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Book Enterprise Demo
        </button>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Core Benefits for Enterprise Teams</h2>
        <ul>
          {enterpriseBenefits.map((benefit) => (
            <li key={benefit} style={{ marginBottom: "0.45rem" }}>
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Use Cases by Role</h2>
        {roleUseCases.map((useCase) => (
          <article key={useCase.role} style={{ marginBottom: "1rem" }}>
            <h3>{useCase.role}</h3>
            <ul>
              {useCase.outcomes.map((outcome) => (
                <li key={`${useCase.role}-${outcome}`}>{outcome}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Enterprise Trust Signals</h2>
        <p>
          Trusted by governance-forward teams across consulting, legal-tech, and enterprise operations. SOC-aligned controls,
          policy traceability, and transparent audit workflows included.
        </p>
        <ul>
          <li>Governance assessment turnaround: under 14 days</li>
          <li>Policy-to-implementation mapping: Patrol Articles I–VII</li>
          <li>Monthly executive governance review cadence</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Pricing & ROI Snapshot</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: "0.5rem" }}>Model</th>
              <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: "0.5rem" }}>Estimated Annual Cost</th>
              <th style={{ borderBottom: "1px solid #d1d5db", textAlign: "left", padding: "0.5rem" }}>Governance Coverage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>Reactive consulting only</td>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>£180k+</td>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>Fragmented / post-incident</td>
            </tr>
            <tr>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>Rasta Imperium program</td>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>£120k–£150k</td>
              <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>Proactive, continuous, auditable</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Discovery Form (Progressive Qualification)</h2>
        <ol>
          <li>Company profile and AI governance maturity</li>
          <li>Compliance scope, data residency, and risk priorities</li>
          <li>Timeline, stakeholders, and CRM routing (HubSpot / Salesforce)</li>
        </ol>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>FAQ for Enterprise Concerns</h2>
        {faqs.map((faq) => (
          <article key={faq.question} style={{ marginBottom: "0.8rem" }}>
            <h3 style={{ marginBottom: "0.2rem" }}>{faq.question}</h3>
            <p style={{ margin: 0 }}>{faq.answer}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Consulting & Workshops</h2>
        <p>{blueprint.description}</p>

        <article>
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
        </article>

        <h3>Mid-Tier Services</h3>
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

        <h3>Workshops</h3>
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
    </main>
  );
}
