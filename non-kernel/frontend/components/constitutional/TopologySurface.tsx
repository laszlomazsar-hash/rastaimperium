import { ReactNode } from "react";

export function TopologySurface({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      {children}
    </div>
  );
}
