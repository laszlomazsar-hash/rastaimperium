import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Rastafarai", description: "Canonical contact route for institutional and enterprise inquiries." };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Contact</p>
      <h1 className="mt-4 text-4xl font-bold">Contact</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        For institutional, enterprise, research, or governance inquiries, use this canonical route as
        the stable entry point while legacy pages remain available until redirects and canonical links
        are implemented.
      </p>
      <a href="mailto:contact@rastafarai.com" className="mt-8 inline-block text-[#B8860B] hover:text-yellow-500">contact@rastafarai.com</a>
    </main>
  );
}
