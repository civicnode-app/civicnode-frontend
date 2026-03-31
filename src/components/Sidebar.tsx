"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Cctv, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",   href: "/dashboard",     icon: LayoutDashboard },
  { label: "System Info", href: "/system-config", icon: Settings        },
  { label: "CCTV & Zona", href: "/cctv",           icon: Cctv            },
];

export function Sidebar() {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("civicnode-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("civicnode-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#DAD7CD] border-r-2 border-[#588157] flex flex-col py-6 overflow-visible transition-[width] duration-300 ease-in-out",
        collapsed ? "w-17 px-2" : "w-64 px-4"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggle}
        title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        className={cn(
          "mb-5 flex items-center justify-center w-7 h-7 rounded-full bg-[#a3b18a] hover:bg-[#588157] text-white transition-colors duration-200 cursor-pointer border-none shrink-0",
          collapsed ? "mx-auto" : "ml-auto"
        )}
      >
        {collapsed
          ? <ChevronRight size={13} strokeWidth={3} />
          : <ChevronLeft  size={13} strokeWidth={3} />
        }
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <div key={href} className="relative group">
              <Link
                href={href}
                className={cn(
                  "flex items-center w-full font-extrabold text-[13px] text-white no-underline transition-colors duration-200 overflow-hidden",
                  collapsed
                    ? "justify-center p-3.5 rounded-2xl"
                    : "gap-3 px-5 py-3.5 rounded-full",
                  isActive
                    ? "bg-[#588157]"
                    : "bg-[#a3b18a] hover:bg-[#588157]"
                )}
              >
                <Icon size={18} strokeWidth={2.5} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">{label}</span>
                )}
              </Link>

              {/* Tooltip — hanya muncul saat collapsed */}
              {collapsed && (
                <div
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                             px-3 py-1.5 bg-[#2d2d2d] text-white text-[11px] font-bold rounded-lg
                             whitespace-nowrap opacity-0 group-hover:opacity-100
                             transition-opacity duration-150"
                >
                  {label}
                  {/* Arrow kiri */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#2d2d2d]" />
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
