const DUMMY_LOGS = [
  { id: 1, location: "Siring", time: "Minggu, 01 Maret 2026 21.21" },
  { id: 2, location: "Siring", time: "Minggu, 01 Maret 2026 21.22" },
  { id: 3, location: "Siring", time: "Minggu, 01 Maret 2026 21.23" },
  { id: 4, location: "Siring", time: "Minggu, 01 Maret 2026 21.24" },
  { id: 5, location: "Siring", time: "Minggu, 01 Maret 2026 21.25" },
  { id: 6, location: "Siring", time: "Minggu, 01 Maret 2026 21.26" },
  { id: 7, location: "Siring", time: "Minggu, 01 Maret 2026 21.27" },
  { id: 8, location: "Siring", time: "Minggu, 01 Maret 2026 21.28" },
  { id: 9, location: "Siring", time: "Minggu, 01 Maret 2026 21.29" },
  { id: 10, location: "Siring", time: "Minggu, 01 Maret 2026 21.30" },
];

export default function TimelineLog() {
  return (
    <div className="relative flex-1 bg-[rgb(202,219,183)] rounded-[30px] p-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-0 py-4 px-6">
        <div className="w-2.5 h-2.5 bg-[#333] rounded-full shrink-0" />
        <span className="font-extrabold text-[13px] tracking-[0.05em]">
          TIMELINE LOG
        </span>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 px-6 py-4 [scrollbar-width:none]">
        {DUMMY_LOGS.map((log) => (
          <div
            key={log.id}
            className="bg-[#a3b18a] px-4 py-3.5 rounded-[18px] text-white shrink-0 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:bg-[#588157] hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
          >
            <p className="m-0 text-[13px] font-bold">{log.location}</p>
            <p className="m-0 mt-0.5 text-[11px] opacity-80">{log.time}</p>
          </div>
        ))}
      </div>

      {/* fade in transition */}
      <div className="absolute w-full pointer-events-none bottom-0 left-0 bg-linear-360 from-[rgba(202,219,183,1)] to-[rgba(202,219,183,0)] h-10"></div>
    </div>
  );
}
