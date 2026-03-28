"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/UserProfile";
import { useDashboardStore } from "@/stores/dashboardStore";

export function DashboardHeader() {
  const { searchQuery, setSearchQuery } = useDashboardStore();

  return (
    <header className="flex justify-between items-center mb-8">
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#a3b18a] px-6 py-2.5 rounded-full w-100">
        <Search size={18} className="text-white/80 shrink-0" />
        <Input
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right side */}
      <UserProfile />
    </header>
  );
}
