import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Consulting — Constitutional AI Architecture Services",
  description: "Enterprise consulting: discovery calls, architecture audits, compliance alignment, and sovereign deployment. From assessment to full constitutional integration.",
};
export default function ConsultingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
