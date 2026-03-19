"use client";
import Link from "next/link";
import Image from "next/image";

/* ── Circular confidence score ring ───────────────────── */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
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
        style={{ transition: "stroke-dashoffset .6s ease, stroke .4s ease" }}
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

export default function Dashboard() {
  const demoScore = 0;
  return (
    <div className="flex min-h-screen w-full">
      {/* --- SIDEBAR KIRI --- */}
      <aside className="w-70 shrink-0 flex flex-col bg-[#DAD7CD] border-r-2 border-[#588157] px-5 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo cv.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="flex gap-1 text-2xl font-extrabold">
              <span className="text-black">CIVIC</span>
              <span className="text-[#588157]">NODE</span>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">
            <button className="w-full px-6 py-4 rounded-full border-none bg-[#588157] text-white font-extrabold text-[15px] text-left cursor-pointer translate-x-2.5 transition-all duration-300">
              DASHBOARD
            </button>
          </Link>
          <Link href="/system-config">
            <button className="w-full px-6 py-4 rounded-full border-none bg-[#a3b18a] text-white font-extrabold text-[15px] text-left cursor-pointer transition-all duration-300 hover:bg-[#588157] hover:translate-x-2.5">
              SYSTEM CONFIG
            </button>
          </Link>
          <Link href="/cctv">
            <button className="w-full px-6 py-4 rounded-full border-none bg-[#a3b18a] text-white font-extrabold text-[15px] text-left cursor-pointer transition-all duration-300 hover:bg-[#588157] hover:translate-x-2.5">
              CCTV
            </button>
          </Link>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 bg-white/15 rounded-full px-5 py-2.5 text-white w-65">
            <span className="text-base opacity-85">🔍</span>
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent border-none text-white outline-none w-full font-bold text-sm placeholder:text-white/70"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Bell */}
            <div className="text-[22px] cursor-pointer relative leading-none">
              🔔
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#588157]" />
            </div>
            {/* Profile */}
            <div className="bg-[#a3b18a] px-5 py-1.5 rounded-full flex items-center gap-2.5 text-white">
              <div className="w-9.5 h-9.5 bg-[#eee] rounded-full border-2 border-[#333] shrink-0" />
              <div className="leading-snug">
                <p className="m-0 font-extrabold text-sm">ATUN</p>
                <p className="m-0 text-[10px] opacity-80">OWNER</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid — 4 kolom */}
        <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2">
          {[
            { label: "ACTIVE DETECTIONS", value: "—" },
            { label: "WASTE REDUCTION", value: "—" },
            { label: "NODE REPUTATION", value: "—" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-[20px] px-6 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col gap-2 min-h-29 justify-between"
            >
              <p className="m-0 text-[11px] font-bold text-[#888] tracking-[0.06em]">
                {s.label}
              </p>
              <p className="m-0 text-[28px] font-black text-[#222]">
                {s.value}
              </p>
            </div>
          ))}

          {/* Confidence Score card */}
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

        {/* Content Row — feed + log */}
        <section className="flex gap-7 min-h-105">
          {/* Time-lapse Feed */}
          <div className="bg-white rounded-[30px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col min-h-105">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-red-500 text-lg">📡</span>
                <span className="text-red-500 font-bold text-sm">
                  Time-lapse Feed
                </span>
              </div>
              <span className="font-extrabold text-[#333] text-sm">CCTV_1</span>
            </div>

            {/* Preview placeholder */}
            <div className="flex-1 bg-[#f5f5f5] rounded-[20px] flex items-center justify-center min-h-70 mt-3">
              <span className="text-5xl opacity-20">📷</span>
            </div>

            <div className="pt-3 border-t border-[#eee] mt-3">
              <p className="m-0 font-extrabold text-base text-[#333]">Siring</p>
              <p className="m-0 mt-1 text-[13px] opacity-60 text-[#333]">
                Minggu, 01 Maret 2026 21.24
              </p>
            </div>
          </div>

          {/* Timeline Log */}
          <div className="flex-1 bg-[#CADBB7] rounded-[30px] p-6 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-2.5 h-2.5 bg-[#333] rounded-full shrink-0" />
              <span className="font-extrabold text-[13px] tracking-[0.05em]">
                TIMELINE LOG
              </span>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 [scrollbar-width:none]">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="bg-[#a3b18a] px-4 py-3.5 rounded-[18px] text-white shrink-0 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.03] hover:bg-[#588157] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
                >
                  <p className="m-0 text-[13px] font-bold">Siring</p>
                  <p className="m-0 mt-0.5 text-[11px] opacity-80">
                    Minggu, 01 Maret 2026 21.2{item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
