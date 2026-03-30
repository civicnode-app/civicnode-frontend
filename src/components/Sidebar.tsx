"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Cctv } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "DASHBOARD",   href: "/dashboard",     icon: LayoutDashboard },
  { label: "SYSTEM INFO", href: "/system-config", icon: Settings        },
  { label: "CCTV & ZONA", href: "/cctv",           icon: Cctv            },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#DAD7CD] px-4 py-6 border-r-2 border-[#588157] flex flex-col overflow-y-auto">
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 w-full px-5 py-3.5 rounded-full font-extrabold text-[14px] text-white no-underline transition-colors duration-200",
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
