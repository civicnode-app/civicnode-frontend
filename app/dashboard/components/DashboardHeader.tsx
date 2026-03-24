export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center gap-4 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2.5 bg-white/15 rounded-full px-5 py-2.5 text-white w-65">
        <span className="text-base opacity-85">🔍</span>
        <input
          type="text"
          placeholder="SEARCH"
          className="bg-transparent border-none text-white outline-none w-full font-bold text-sm placeholder:text-white/70"
        />
      </div>

      {/* Right actions */}
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
  );
}
