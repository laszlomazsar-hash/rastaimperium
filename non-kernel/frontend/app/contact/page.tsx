import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Rasta Imperium",
  description:
    "Start an institutional, research, or governance inquiry with Rasta Imperium. Design partner pilots and commercial briefs.",
};

export default function ContactPage() {
  return <ContactClient />;
}
