import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
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
  );
}
