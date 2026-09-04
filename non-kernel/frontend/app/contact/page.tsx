import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Design partner pilots & institutional AI governance",
  description:
    "Engage Rasta Imperium for design partner pilots, institutional governance inquiries, research collaboration, commercial briefs, or governance audits. Evidence-bound engagement desk.",
  keywords: [
    "AI governance contact",
    "design partner pilot application",
    "institutional AI inquiry",
    "EVO-V pilot",
  ],
  openGraph: {
    title: "Contact — Design partner pilots & institutional AI governance",
    description:
      "Start a pilot application or institutional inquiry. Fixed-scope engagements for teams that need reconstructible, bounded autonomy.",
    url: "https://rastaimperium.com/contact/",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
