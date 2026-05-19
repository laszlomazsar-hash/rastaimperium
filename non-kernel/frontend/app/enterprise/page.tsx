"use client";

const trustSignals = [
  "AI governance playbooks mapped to executive risk committees",
  "Deployment controls aligned to SOC 2, ISO 27001, and regional privacy obligations",
  "Cross-functional enablement for legal, security, and product teams",
];

const caseStudies = [
  {
    title: "Global financial services group",
    outcome: "Reduced model approval cycle time by 43% while improving auditability.",
  },
  {
    title: "Healthcare operations network",
    outcome: "Established compliant AI triage workflows with governance sign-off in 6 weeks.",
  },
  {
    title: "Enterprise SaaS platform",
    outcome: "Launched a phased AI copilots roadmap tied to measurable revenue outcomes.",
  },
];

export default function EnterprisePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "980px", margin: "0 auto" }}>
      <h1>Enterprise AI Acquisition Flow</h1>
      <p>
        Move from interest to deployment with a structured enterprise pathway focused on governance,
        measurable outcomes, and implementation confidence.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Choose Your Next Step</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <a href="/enterprise/intake?track=discovery" style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", textDecoration: "none" }}>
            <h3>Book a Discovery Call</h3>
            <p>Align stakeholders on use-case scope and decision criteria.</p>
          </a>
          <a href="/enterprise/intake?track=diagnostic" style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", textDecoration: "none" }}>
            <h3>Request an AI Diagnostic</h3>
            <p>Assess governance posture, risks, and deployment readiness.</p>
          </a>
          <a href="/enterprise/intake?track=proposal" style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", textDecoration: "none" }}>
            <h3>Start Proposal Process</h3>
            <p>Receive a scoped commercial plan tied to your transformation goals.</p>
          </a>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Trust & Proof</h2>
        <ul>
          {trustSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: "1rem" }}>
          {caseStudies.map((caseStudy) => (
            <article key={caseStudy.title} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1rem" }}>
              <h3>{caseStudy.title}</h3>
              <p>{caseStudy.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Governance Outcomes</h2>
        <p>
          Every engagement includes accountable controls, policy traceability, and compliance positioning
          that supports regulators, procurement, and board-level oversight.
        </p>
        <a href="/enterprise/intake" style={{ display: "inline-block", marginTop: "0.5rem" }}>
          Continue to Enterprise Intake →
        </a>
      </section>
    </main>
  );
}
