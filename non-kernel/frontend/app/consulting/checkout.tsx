"use client";

import { FormEvent, useState } from "react";
import { apiUrl } from "../utils/api";

const plans = [
  { name: "Entry", price: "£47/mo" },
  { name: "Mid-Tier", price: "£12k–£18k modules" },
  { name: "High-Ticket", price: "£25k–£35k consulting" },
];

export default function ConsultingCheckout() {
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      company: formData.get("company") || null,
      message: formData.get("message") || null,
      source_page: "checkout",
      consent: Boolean(formData.get("consent")),
      qualification_metadata: {
        funnel_stage: "checkout",
        selected_plan: formData.get("selected_plan"),
      },
    };

    try {
      setIsSubmitting(true);
      setStatusMessage("Submitting your checkout request...");
      const response = await fetch(apiUrl("/api/v1/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.detail || "Checkout lead capture failed. Please try again.");
        return;
      }

      setStatusMessage("Success. A strategist will contact you to finalize your plan.");
      form.reset();
    } catch (error) {
      setStatusMessage("Network issue during checkout request. Please retry shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>Consulting Checkout</h1>
      <ul>
        {plans.map((plan) => (
          <li key={plan.name}>
            {plan.name}: {plan.price}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: ".75rem", maxWidth: 560 }}>
        <input type="text" name="full_name" placeholder="Full name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="company" placeholder="Company (optional)" />
        <select name="selected_plan" required>
          <option value="">Select intended plan</option>
          {plans.map((plan) => (
            <option key={plan.name} value={plan.name}>
              {plan.name}
            </option>
          ))}
        </select>
        <textarea name="message" placeholder="Any requirements before checkout?" rows={4} />
        <label>
          <input type="checkbox" name="consent" required /> I consent to being contacted about this purchase inquiry.
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit checkout request"}
        </button>
      </form>
      {statusMessage ? <p>{statusMessage}</p> : null}
    </main>
  );
}
