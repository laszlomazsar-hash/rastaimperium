type RISealProps = {
  size?: number;
  variant?: "gold" | "bone" | "ink";
  showWordmark?: boolean;
  compact?: boolean;
  className?: string;
};

const palette = {
  gold: { mark: "#F2D675", secondary: "#B88718", word: "#F2D675", fill: "#F2D675" },
  bone: { mark: "#F3EEDF", secondary: "#B88718", word: "#F3EEDF", fill: "#F3EEDF" },
  ink: { mark: "#090A09", secondary: "#B88718", word: "#090A09", fill: "#090A09" },
} as const;

/**
 * Rasta Imperium institutional seal — LM monogram primary brand mark.
 * Hexagonal constitutional enclosure + constructed LM (Identity · Witness · Verification).
 * Brand identity uses the monogram, not a five-pointed star.
 * Content/codex stars elsewhere are unrelated and must not be removed globally.
 * Brand mark only — not an evidence claim.
 */
export function RISeal({
  size = 36,
  variant = "gold",
  showWordmark = false,
  compact = false,
  className = "",
}: RISealProps) {
  const c = palette[variant];
  return (
    <span
      className={`ri-seal ${compact ? "ri-seal--compact" : ""} ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", gap: showWordmark ? "0.7rem" : 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Rasta Imperium LM monogram"
        focusable="false"
      >
        {/* Outer hexagon — constitutional enclosure */}
        <path
          d="M32 4 L55 17 L55 47 L32 60 L9 47 L9 17 Z"
          fill="none"
          stroke={c.mark}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* Inner hexagon */}
        <path
          d="M32 12 L48 21 L48 43 L32 52 L16 43 L16 21 Z"
          fill="none"
          stroke={c.secondary}
          strokeWidth="1.35"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/*
          Constructed LM monogram (not plain text).
          L: vertical + baseline with architectural terminals.
          M: twin peaks sharing a clear negative-space valley.
          Geometry tuned for small sizes (favicon / header).
        */}
        <g
          fill="none"
          stroke={c.mark}
          strokeWidth="2.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {/* L */}
          <path d="M20 19 L20 45 L30 45" />
          {/* M */}
          <path d="M33 45 L33 19 L39.5 34 L46 19 L46 45" />
        </g>
        {/* Subtle witness point — accountability mark, not a brand star */}
        <circle cx="32" cy="50.5" r="1.15" fill={c.secondary} opacity="0.95" />
      </svg>
      {showWordmark && (
        <span
          style={{
            color: c.word,
            fontFamily: "Cinzel, Georgia, serif",
            fontSize: compact ? "0.72rem" : "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            whiteSpace: "nowrap",
          }}
        >
          RASTA IMPERIUM
        </span>
      )}
    </span>
  );
}

export default RISeal;
