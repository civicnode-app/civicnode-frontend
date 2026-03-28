"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Cctv } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "DASHBOARD",   href: "/dashboard",     icon: LayoutDashboard },
  { label: "SYSTEM INFO", href: "/system-config", icon: Settings        },
  { label: "CCTV",        href: "/cctv",           icon: Cctv            },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-70 shrink-0 bg-[#DAD7CD] px-5 py-10 border-r-2 border-[#588157] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="mb-12 flex items-center gap-3">
        <Image
          src="/logo cv.png"
          alt="CivicNode Logo"
          width={40}
          height={40}
          className="transition-transform duration-500 hover:rotate-180"
        />
        <div className="flex gap-1 text-2xl font-extrabold">
          <span className="text-black">CIVIC</span>
          <span className="text-[#588157]">NODE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 w-full px-5 py-3.5 rounded-full font-extrabold text-[15px] text-white no-underline transition-colors duration-200",
                isActive ? "bg-[#588157]" : "bg-[#a3b18a] hover:bg-[#588157]"
              )}
            >
              <Icon size={18} strokeWidth={2.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
