export default function ScoreRing({
  score,
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444";
  const tag = score >= 75 ? "AMAN" : score >= 50 ? "WASPADA" : "BAHAYA";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      {/* track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#efefef"
        strokeWidth={size * 0.09}
      />
      {/* progress */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.09}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="[transition:stroke-dashoffset_.6s_ease,stroke_.4s_ease]"
      />
      {/* score number */}
      <text
        x={cx}
        y={cy - size * 0.04}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontWeight="900"
        fontSize={size * 0.22}
      >
        {score}
      </text>
      {/* label */}
      <text
        x={cx}
        y={cy + size * 0.22}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#b0b0b0"
        fontWeight="700"
        fontSize={size * 0.11}
      >
        {tag}
      </text>
    </svg>
  );
}
