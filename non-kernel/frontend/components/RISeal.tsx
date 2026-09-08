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
 * Rasta Imperium institutional seal — updated to match the new LM monogram + star brand assets.
 * Hexagonal constitutional enclosure, LM letters, central gold star (witness).
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
        aria-label="Rasta Imperium seal"
        focusable="false"
      >
        {/* Outer hexagon */}
        <path
          d="M32 4 L55 17 L55 47 L32 60 L9 47 L9 17 Z"
          fill="none"
          stroke={c.mark}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner hexagon */}
        <path
          d="M32 11 L49 21 L49 43 L32 53 L15 43 L15 21 Z"
          fill="none"
          stroke={c.secondary}
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {/* LM monogram (simplified, matches new assets) */}
        <g fill="none" stroke={c.mark} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          {/* L */}
          <path d="M22 20 L22 44 L31 44" />
          {/* M */}
          <path d="M34 44 L34 20 L40 32 L46 20 L46 44" />
        </g>
        {/* Central star (witness) */}
        <g transform="translate(32, 32)" fill={c.fill}>
          <polygon points="0,-5.5 1.5,-1.5 5.5,0 1.5,1.5 0,5.5 -1.5,1.5 -5.5,0 -1.5,-1.5" />
          <polygon points="0,-5.5 1.5,-1.5 5.5,0 1.5,1.5 0,5.5 -1.5,1.5 -5.5,0 -1.5,-1.5" transform="rotate(45)" opacity="0.9" />
        </g>
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
