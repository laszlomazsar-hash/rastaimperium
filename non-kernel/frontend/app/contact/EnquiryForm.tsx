"use client";

import Link from "next/link";
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

  if (state === "success") {
    return (
      <div className="royal-panel rounded-xl border p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
          Received · human review
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-[#F2D675]">Thank you — your enquiry is in the desk.</h2>
        {reference && (
          <p className="mt-2 font-mono text-sm text-zinc-300">
            Reference · {reference}
          </p>
        )}
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          {isPilot
            ? "What happens next: we review fit against scope, stack, and success criteria, then reply with a written boundary and indicative commercial outline — or a clear decline if the engagement is not a match."
            : "What happens next: a human reviews the context and replies with the appropriate pathway (pilot, audit, research, or commercial brief)."}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-zinc-300">
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>No automated decision is made from this form</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Typical response window: a few business days</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>You can continue evaluating via Proof and Limitations meanwhile</span>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/proof/"
            className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
          >
            Open Proof Registry
          </Link>
          <Link
            href="/limitations/"
            className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
          >
            Limitations
          </Link>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm text-zinc-100"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="royal-panel rounded-xl border p-6 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
        {isPilot ? "Design partner intake" : isAudit ? "Audit intake" : "Secure enquiry channel"}
      </p>
      <h2 className="mt-3 font-cinzel text-3xl text-[#F2D675]">
        {isPilot ? "Pilot application" : "Send the context directly."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        {isPilot
          ? "Fixed-scope pilots are typically $50k–$150k over 8–12 weeks. Fields below help establish fit before a scoping reply. Human review only — not an automated acceptance."
          : "Your submission is stored for human review in the engagement desk. No automated decision is made from this form."}
      </p>

      {isPilot && (
        <div className="mt-5 rounded-lg border border-[#B8860B]/25 bg-black/30 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">
            What happens after you submit
          </p>
          <ol className="mt-2 space-y-1.5 text-xs leading-5 text-zinc-400">
            <li>1 · Desk reviews organisation, stack, risk surface, and success criteria</li>
            <li>2 · Reply with written boundary + indicative commercial outline — or a clear decline</li>
            <li>3 · Mutual agreement on scope before any pilot kickoff</li>
          </ol>
        </div>
      )}

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
        className="royal-button royal-button-primary mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-6 py-3 font-bold text-[#12130f] transition hover:bg-[#F2D675] disabled:cursor-wait disabled:opacity-60"
      >
        {state === "submitting"
          ? "Sending to the engagement desk…"
          : isPilot
            ? "Submit pilot application"
            : "Send enquiry"}
      </button>

      {state === "error" && (
        <div role="alert" className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-center text-sm text-red-200">
          <p>The engagement desk channel is temporarily unavailable.</p>
          <p className="mt-2 text-xs text-red-200/80">
            Email{" "}
            <a className="underline hover:text-white" href="mailto:lazzlowtuning@me.com?subject=Design%20partner%20pilot%20inquiry">
              lazzlowtuning@me.com
            </a>{" "}
            with the same context, or try again shortly.
          </p>
        </div>
      )}

      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
        Human review only · not used for automated decisions · see{" "}
        <a href="/limitations/" className="underline hover:text-[#F2D675]">
          Limitations
        </a>
        {" · "}
        <a href="/institutional-pilots/" className="underline hover:text-[#F2D675]">
          Pilot pathway
        </a>
      </p>
    </form>
  );
}
