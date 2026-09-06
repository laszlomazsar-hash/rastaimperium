type RISealProps = {
  size?: number;
  variant?: "gold" | "bone" | "ink";
  showWordmark?: boolean;
  compact?: boolean;
  className?: string;
};

const palette = {
  gold: { mark: "#F2D675", secondary: "#B88718", word: "#F2D675" },
  bone: { mark: "#F3EEDF", secondary: "#B88718", word: "#F3EEDF" },
  ink: { mark: "#090A09", secondary: "#B88718", word: "#090A09" },
} as const;

/**
 * Rasta Imperium institutional seal.
 * Boundary = constitutional enclosure; axis = governed continuity; centre = witness.
 * Keep this geometry stable: it is a brand mark, not an evidence claim.
 */
export function RISeal({
  size = 36,
  variant = "gold",
  showWordmark = false,
  compact = false,
  className = "",
}: RISealProps) {
  const c = palette[variant];
  const height = showWordmark ? size : size;
  return (
    <span
      className={`ri-seal ${compact ? "ri-seal--compact" : ""} ${className}`.trim()}
      style={{ display: "inline-flex", alignItems: "center", gap: showWordmark ? "0.7rem" : 0 }}
    >
      <svg
        width={size}
        height={height}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Rasta Imperium seal"
        focusable="false"
      >
        <path
          d="M32 4 L55 17 L55 47 L32 60 L9 47 L9 17 Z"
          fill="none"
          stroke={c.mark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M32 12 L32 52" stroke={c.mark} strokeWidth="2" strokeLinecap="round" />
        <path d="M20 25 L32 32 L44 25" fill="none" stroke={c.secondary} strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 39 L32 32 L44 39" fill="none" stroke={c.secondary} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="3.2" fill={c.mark} />
        <path d="M16 17 L32 8 L48 17" fill="none" stroke={c.mark} strokeWidth="1" opacity="0.65" />
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
