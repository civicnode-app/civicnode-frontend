import ScoreRing from "./ScoreRing";

const STATS = [
  { label: "ACTIVE DETECTIONS", value: "—" },
  // { label: "WASTE REDUCTION", value: "—" },
  { label: "ZONE REPUTATION", value: "—" },
];

export default function StatsGrid({ demoScore }: { demoScore: number }) {
  return (
    <section className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 mx-auto w-280">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between"
        >
          <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">
            {s.label}
          </p>
          <p className="m-0 text-[28px] font-black text-[#222]">{s.value}</p>
        </div>
      ))}

      {/* Confidence Score */}
      <div className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-1.5 min-h-29 justify-between">
        <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">
          CONFIDENCE SCORE
        </p>
        <div className="flex items-center gap-3">
          <ScoreRing score={demoScore} size={72} />
          <div className="flex flex-col gap-1">
            <p className="m-0 text-[11px] font-bold text-[#aaa]">
              {demoScore}/100
            </p>
            <p className="m-0 text-[10px] text-[#ccc]">Rata-rata skor</p>
          </div>
        </div>
      </div>
    </section>
  );
}
