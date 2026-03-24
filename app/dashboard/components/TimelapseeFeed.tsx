export default function TimelapseeFeed() {
  return (
    <div className="w-120 shrink-0 bg-white rounded-[30px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col min-h-105">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-red-500 text-lg">📡</span>
          <span className="text-red-500 font-bold text-sm">Time-lapse Feed</span>
        </div>
        <span className="font-extrabold text-[#333] text-sm">CCTV_1</span>
      </div>

      {/* Preview placeholder */}
      <div className="flex-1 bg-[#f5f5f5] rounded-[20px] flex items-center justify-center min-h-70 mt-3">
        <span className="text-5xl opacity-20">📷</span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#eee] mt-3">
        <p className="m-0 font-extrabold text-base text-[#333]">Siring</p>
        <p className="m-0 mt-1 text-[13px] opacity-60 text-[#333]">
          Minggu, 01 Maret 2026 21.24
        </p>
      </div>
    </div>
  );
}
