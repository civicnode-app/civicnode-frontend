"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "DASHBOARD",   href: "/dashboard" },
  { label: "SYSTEM INFO", href: "/system-config" },
  { label: "CCTV",        href: "/cctv" },
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
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="no-underline">
              <Button
                variant={isActive ? "active" : "default"}
                size="menu"
                className={cn(
                  "transition-all duration-300",
                  isActive && "translate-x-2.5",
                )}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
