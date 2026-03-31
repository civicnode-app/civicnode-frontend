"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Cctv, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",   href: "/dashboard",     icon: LayoutDashboard },
  { label: "System Info", href: "/system-config", icon: Settings        },
  { label: "CCTV & Zona", href: "/cctv",           icon: Cctv            },
];

export function Sidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("civicnode-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  // Keyboard shortcut: Ctrl+B
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        setCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("civicnode-sidebar-collapsed", String(next));
          return next;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      <div className={cn("relative group mb-5", collapsed ? "flex justify-center" : "flex justify-end")}>
        <button
          onClick={toggle}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#a3b18a] hover:bg-[#588157] text-white transition-colors duration-200 cursor-pointer border-none shrink-0"
        >
          {collapsed
            ? <PanelLeftOpen  size={16} strokeWidth={2} />
            : <PanelLeftClose size={16} strokeWidth={2} />
          }
        </button>

        {/* Tooltip toggle */}
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 flex items-center gap-2.5 px-3 py-2 bg-[#1a1a1a] text-white text-[12px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
          {collapsed ? <PanelLeftOpen size={14} strokeWidth={2} /> : <PanelLeftClose size={14} strokeWidth={2} />}
          <span>{collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}</span>
          <kbd className="ml-1 px-1.5 py-0.5 bg-white/15 rounded text-[10px] font-mono font-bold">Ctrl+B</kbd>
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
        </div>
      </div>

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
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>

              {/* Tooltip nav item — hanya saat collapsed */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] text-white text-[12px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                  {label}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]" />
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
