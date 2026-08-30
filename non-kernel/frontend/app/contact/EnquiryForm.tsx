"use client";

import { FormEvent, useState } from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export default function EnquiryForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
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

  return (
    <form onSubmit={handleSubmit} className="border border-[#D4AF37]/25 bg-[#11150f]/85 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Secure enquiry channel</p>
      <h2 className="mt-3 font-serif text-3xl text-[#F2D675]">Send the context directly.</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">Your submission is stored for human review in the Rasta Imperium engagement desk. No automated decision is made from this form.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-zinc-200">Name<input required name="name" autoComplete="name" className="mt-2 w-full rounded-md border border-zinc-700 bg-[#090a09] px-4 py-3 text-zinc-100 outline-none transition focus:border-[#F2D675]" placeholder="Laszlo Mazsar" /></label>
        <label className="text-sm text-zinc-200">Work email<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-md border border-zinc-700 bg-[#090a09] px-4 py-3 text-zinc-100 outline-none transition focus:border-[#F2D675]" placeholder="you@organisation.org" /></label>
      </div>
      <label className="mt-5 block text-sm text-zinc-200">What should be inspectable?<textarea required name="context" minLength={20} rows={5} className="mt-2 w-full resize-y rounded-md border border-zinc-700 bg-[#090a09] px-4 py-3 text-zinc-100 outline-none transition focus:border-[#F2D675]" placeholder="Describe the decision, constraint, or institutional responsibility..." /></label>
      <label className="sr-only">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-zinc-400"><input required type="checkbox" name="consent" value="true" className="mt-1 accent-[#D4AF37]" />I consent to Rasta Imperium using these details to respond to this enquiry.</label>
      <button type="submit" disabled={state === "submitting"} className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#D4AF37] px-6 py-3 font-bold text-[#12130f] transition hover:bg-[#F2D675] disabled:cursor-wait disabled:opacity-60">{state === "submitting" ? "Sending to the engagement desk…" : state === "success" ? `Received · ${reference}` : "Send enquiry"}</button>
      {state === "success" && <p role="status" className="mt-3 text-center text-sm text-emerald-300">Your enquiry was received for human review.</p>}
      {state === "error" && <p role="alert" className="mt-3 text-center text-sm text-red-300">The engagement desk is temporarily unavailable. Please try again shortly.</p>}
      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">Your enquiry is routed for human review and is not used to make an automated decision.</p>
    </form>
  );
}
