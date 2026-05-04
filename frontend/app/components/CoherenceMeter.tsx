type CoherenceMeterProps = {
  score: number;
};

export function CoherenceMeter({ score }: CoherenceMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <section>
      <h3>Layer Coherence</h3>
      <div style={{ background: "#1a1a1a", height: 14, borderRadius: 8, overflow: "hidden" }}>
        <div
          style={{
            width: `${clampedScore}%`,
            height: "100%",
            background: clampedScore > 90 ? "#00c853" : clampedScore > 75 ? "#ffd600" : "#d50000",
          }}
        />
      </div>
      <small>{clampedScore.toFixed(2)}% across L1–L9</small>
    </section>
  );
}
