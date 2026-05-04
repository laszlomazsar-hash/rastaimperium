"use client";

export default function EnterpriseIntakePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "860px", margin: "0 auto" }}>
      <h1>Enterprise Intake Form</h1>
      <p>
        Submit qualification details and we will route your request to the enterprise team within one
        business day.
      </p>

      <form action="/enterprise/intake/submit" method="post" style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
        <label>
          Full Name
          <input type="text" name="name" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
        </label>

        <label>
          Work Email
          <input type="email" name="email" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
        </label>

        <label>
          Company Name
          <input type="text" name="company" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
        </label>

        <label>
          Company Size
          <select name="company_size" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
            <option value="">Select one</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-250">51-250 employees</option>
            <option value="251-1000">251-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </label>

        <label>
          Primary AI Use Case
          <textarea name="ai_use_case" rows={3} required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
        </label>

        <label>
          Target Timeline
          <select name="timeline" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
            <option value="">Select one</option>
            <option value="0-3 months">0-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="12+ months">12+ months</option>
          </select>
        </label>

        <label>
          Budget Band
          <select name="budget_band" required style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
            <option value="">Select one</option>
            <option value="under-50k">Under £50K</option>
            <option value="50k-150k">£50K-£150K</option>
            <option value="150k-500k">£150K-£500K</option>
            <option value="500k+">£500K+</option>
          </select>
        </label>

        <label>
          Notes
          <textarea name="notes" rows={4} style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
        </label>

        <button type="submit" style={{ padding: "0.7rem 1.2rem", cursor: "pointer" }}>Submit Intake</button>
      </form>
    </main>
  );
}
