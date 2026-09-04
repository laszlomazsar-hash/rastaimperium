"use client";

import { FormEvent, useState } from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

type Props = {
  intent?: string;
};

export default function EnquiryForm({ intent = "" }: Props) {
  const [state, setState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");

  const isPilot = intent === "design-partner" || intent === "pilot";
  const isAudit = intent === "audit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intent: intent || data.intent || "" }),
      });
      const payload = (await response.json()) as { ok?: boolean; reference?: string };
      if (!response.ok || !payload.ok) throw new Error("Submission failed");
      setReference(payload.reference ?? "");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  const field =
    "mt-2 w-full rounded-md border border-zinc-700 bg-[#090a09] px-4 py-3 text-zinc-100 outline-none transition focus:border-[#F2D675]";

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#D4AF37]/25 bg-[#11150f]/85 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
        {isPilot ? "Design partner intake" : isAudit ? "Audit intake" : "Secure enquiry channel"}
      </p>
      <h2 className="mt-3 font-serif text-3xl text-[#F2D675]">
        {isPilot ? "Pilot application" : "Send the context directly."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        {isPilot
          ? "Fixed-scope pilots are typically $50k–$150k over 8–12 weeks. Fields below help establish fit before a scoping call. Submission is for human review only."
          : "Your submission is stored for human review in the Rasta Imperium engagement desk. No automated decision is made from this form."}
      </p>

      <input type="hidden" name="intent" value={intent} />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-200">
          Name
          <input required name="name" autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="text-sm text-zinc-200">
          Work email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className={field}
            placeholder="you@organisation.org"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-200">
          Organisation
          <input
            name="organisation"
            autoComplete="organization"
            className={field}
            placeholder="Institution or company"
            required={isPilot}
          />
        </label>
        <label className="text-sm text-zinc-200">
          Role
          <input name="role" className={field} placeholder="CTO, Head of Risk, Research lead…" />
        </label>
      </div>

      {isPilot && (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-zinc-200">
              Primary stack / environment
              <select name="stack" className={field} required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option value="cloud-saas">Cloud / SaaS agents</option>
                <option value="enterprise-onprem">Enterprise on-prem</option>
                <option value="air-gapped">Air-gapped / regulated</option>
                <option value="research-lab">Research lab</option>
                <option value="hybrid">Hybrid</option>
                <option value="other">Other / mixed</option>
              </select>
            </label>
            <label className="text-sm text-zinc-200">
              Desired timeline
              <select name="timeline" className={field} required defaultValue="">
                <option value="" disabled>
                  Select…
                </option>
                <option value="0-4w">Within 4 weeks</option>
                <option value="1-3m">1–3 months</option>
                <option value="3-6m">3–6 months</option>
                <option value="exploratory">Exploratory / no fixed date</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block text-sm text-zinc-200">
            Risk surface in scope
            <textarea
              required
              name="risk_surface"
              minLength={20}
              rows={3}
              className={field}
              placeholder="Which decisions, agents, or workflows must remain reconstructible and bounded?"
            />
          </label>

          <label className="mt-5 block text-sm text-zinc-200">
            Success criteria (pilot)
            <textarea
              required
              name="success_criteria"
              minLength={15}
              rows={3}
              className={field}
              placeholder="What would make an 8–12 week pilot a clear yes/no for production path?"
            />
          </label>

          <label className="mt-5 block text-sm text-zinc-200">
            Compliance / audit context (optional)
            <input
              name="compliance"
              className={field}
              placeholder="e.g. internal model risk, SOC2, sector regulator, research ethics"
            />
          </label>
        </>
      )}

      <label className="mt-5 block text-sm text-zinc-200">
        {isPilot ? "Additional context" : "What should be inspectable?"}
        <textarea
          required={!isPilot}
          name="context"
          minLength={isPilot ? 0 : 20}
          rows={isPilot ? 3 : 5}
          className={field}
          placeholder={
            isPilot
              ? "Anything else the engagement desk should know…"
              : "Describe the decision, constraint, or institutional responsibility…"
          }
        />
      </label>

      <label className="sr-only">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-zinc-400">
        <input required type="checkbox" name="consent" value="true" className="mt-1 accent-[#D4AF37]" />
        I consent to Rasta Imperium using these details to respond to this enquiry.
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-6 py-3 font-bold text-[#12130f] transition hover:bg-[#F2D675] disabled:cursor-wait disabled:opacity-60"
      >
        {state === "submitting"
          ? "Sending to the engagement desk…"
          : state === "success"
            ? `Received · ${reference}`
            : isPilot
              ? "Submit pilot application"
              : "Send enquiry"}
      </button>

      {state === "success" && (
        <p role="status" className="mt-3 text-center text-sm text-emerald-300">
          Your enquiry was received for human review.
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="mt-3 text-center text-sm text-red-300">
          The engagement desk is temporarily unavailable. Please try again shortly, or email
          lazzlowtuning@me.com.
        </p>
      )}
      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
        Human review only · not used for automated decisions · see{" "}
        <a href="/limitations/" className="underline hover:text-[#F2D675]">
          Limitations
        </a>
      </p>
    </form>
  );
}
