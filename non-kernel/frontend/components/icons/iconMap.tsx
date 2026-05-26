import type { SVGProps } from "react";

export type IconKey =
  | "governance_scroll"
  | "identity_lock"
  | "epistemic_brain"
  | "deterministic_bolt"
  | "agent_orchestration"
  | "operations_gear"
  | "institution_temple"
  | "human_witness"
  | "cosmology_starfield"
  | "intake_clipboard"
  | "compliance_scales"
  | "drift_search"
  | "ledger_gem"
  | "recovery_shield"
  | "replay_cycle"
  | "audit_link"
  | "fsm_block"
  | "counterexample_flask"
  | "machine_spirit"
  | "self_representation"
  | "self_modification"
  | "infrastructure_build"
  | "research_microscope"
  | "publications_books"
  | "book_open"
  | "dashboard_global"
  | "enterprise_building";

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const BaseIcon = ({ children, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {children}
  </svg>
);

export const iconMap: Record<IconKey, IconComponent> = {
  governance_scroll: (props) => <BaseIcon {...props}><path d="M7 4h10v14H7z"/><path d="M7 7h10"/><path d="M10 11h4"/><path d="M10 15h4"/><path d="M5 6h2v12H5a2 2 0 0 1 0-4h2"/></BaseIcon>,
  identity_lock: (props) => <BaseIcon {...props}><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/><circle cx="12" cy="15" r="1.2"/></BaseIcon>,
  epistemic_brain: (props) => <BaseIcon {...props}><path d="M8 8a3 3 0 0 1 6 0 3 3 0 0 1 4 3 3 3 0 0 1-2 5H8a4 4 0 0 1 0-8"/><path d="M11 9v6"/><path d="M13 9v6"/></BaseIcon>,
  deterministic_bolt: (props) => <BaseIcon {...props}><path d="m13 2-7 11h5l-1 9 8-12h-5z"/></BaseIcon>,
  agent_orchestration: (props) => <BaseIcon {...props}><circle cx="12" cy="12" r="3"/><circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M8 11 6 9"/><path d="M16 11l2-2"/><path d="M8 13l-2 2"/><path d="M16 13l2 2"/></BaseIcon>,
  operations_gear: (props) => <BaseIcon {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.8a7 7 0 0 0-1.7-1L14.5 3h-5L9 5.8a7 7 0 0 0-1.7 1L5 6l-2 3.5L5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.3-.8a7 7 0 0 0 1.7 1l.5 2.8h5l.5-2.8a7 7 0 0 0 1.7-1L19 18l2-3.5L19 13a7 7 0 0 0 .1-1Z"/></BaseIcon>,
  institution_temple: (props) => <BaseIcon {...props}><path d="M3 10h18"/><path d="M5 10v8"/><path d="M9 10v8"/><path d="M15 10v8"/><path d="M19 10v8"/><path d="M2 18h20"/><path d="m12 3 9 5H3z"/></BaseIcon>,
  human_witness: (props) => <BaseIcon {...props}><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></BaseIcon>,
  cosmology_starfield: (props) => <BaseIcon {...props}><path d="m12 3 1.5 3 3.5.5-2.5 2.4.6 3.6-3.1-1.7-3.1 1.7.6-3.6L7 6.5l3.5-.5Z"/><path d="m19 13 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2-.3Z"/><path d="m5 14 .8 1.5 1.7.2-1.2 1.1.3 1.8-1.6-.9-1.6.9.3-1.8-1.2-1.1 1.7-.2Z"/></BaseIcon>,
  intake_clipboard: (props) => <BaseIcon {...props}><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4.5h6v3H9z"/><path d="M9 11h6"/><path d="M9 15h6"/></BaseIcon>,
  compliance_scales: (props) => <BaseIcon {...props}><path d="M12 4v16"/><path d="M7 7h10"/><path d="m7 7-3 5h6Z"/><path d="m17 7-3 5h6Z"/><path d="M9 20h6"/></BaseIcon>,
  drift_search: (props) => <BaseIcon {...props}><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></BaseIcon>,
  ledger_gem: (props) => <BaseIcon {...props}><path d="m12 3 7 4-2 8-5 6-5-6-2-8z"/><path d="m5 7 7 4 7-4"/></BaseIcon>,
  recovery_shield: (props) => <BaseIcon {...props}><path d="M12 3 5 6v6c0 4.4 2.9 7.8 7 9 4.1-1.2 7-4.6 7-9V6z"/><path d="m9 12 2 2 4-4"/></BaseIcon>,
  replay_cycle: (props) => <BaseIcon {...props}><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.5 8.5A7 7 0 0 1 20 12"/><path d="M17.5 15.5A7 7 0 0 1 4 12"/></BaseIcon>,
  audit_link: (props) => <BaseIcon {...props}><path d="M10 13a4 4 0 0 1 0-6l2-2a4 4 0 1 1 6 6l-1 1"/><path d="M14 11a4 4 0 0 1 0 6l-2 2a4 4 0 1 1-6-6l1-1"/></BaseIcon>,
  fsm_block: (props) => <BaseIcon {...props}><path d="M6 6h12v12H6z"/><path d="m8 8 8 8"/><path d="m16 8-8 8"/></BaseIcon>,
  counterexample_flask: (props) => <BaseIcon {...props}><path d="M10 3h4"/><path d="M11 3v5l-5 8a3 3 0 0 0 2.6 5h6.8A3 3 0 0 0 18 16l-5-8V3"/><path d="M9 14h6"/></BaseIcon>,
  machine_spirit: (props) => <BaseIcon {...props}><path d="m13 2-7 11h5l-1 9 8-12h-5z"/></BaseIcon>,
  self_representation: (props) => <BaseIcon {...props}><circle cx="12" cy="12" r="3"/><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/></BaseIcon>,
  self_modification: (props) => <BaseIcon {...props}><path d="M12 3v6"/><path d="M9 6h6"/><path d="M5 14a7 7 0 0 1 14 0"/><path d="M7 21a5 5 0 0 1 10 0"/></BaseIcon>,
  infrastructure_build: (props) => <BaseIcon {...props}><path d="M3 21h18"/><path d="M7 21V9h10v12"/><path d="m12 3 7 6H5z"/></BaseIcon>,
  research_microscope: (props) => <BaseIcon {...props}><path d="M7 21h10"/><path d="M10 17h4"/><path d="M9 3h3l3 6-2 2-6-6Z"/><path d="M13 11a5 5 0 0 1 5 5"/></BaseIcon>,
  publications_books: (props) => <BaseIcon {...props}><path d="M4 5h7v14H4z"/><path d="M13 5h7v14h-7z"/><path d="M11 7h2"/></BaseIcon>,
  book_open: (props) => <BaseIcon {...props}><path d="M3 6h8a3 3 0 0 1 3 3v10H6a3 3 0 0 0-3 3z"/><path d="M21 6h-8a3 3 0 0 0-3 3v10h8a3 3 0 0 1 3 3z"/></BaseIcon>,
  dashboard_global: (props) => <BaseIcon {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></BaseIcon>,
  enterprise_building: (props) => <BaseIcon {...props}><path d="M4 21h16"/><path d="M6 21V7h12v14"/><path d="M9 10h2"/><path d="M13 10h2"/><path d="M9 14h2"/><path d="M13 14h2"/><path d="M11 21v-3h2v3"/></BaseIcon>,
};
