"use client";

import { AppLayout } from "@/components/AppLayout";
import StatsGrid from "./components/StatsGrid";
import TimelapseeFeed from "./components/TimelapseeFeed";
import TimelineLog from "./components/TimelineLog";

export default function Dashboard() {
  return (
    <AppLayout>
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6 overflow-y-auto">
        <StatsGrid />
        <section className="flex gap-7 min-h-105 max-h-120">
          <TimelapseeFeed />
          <TimelineLog />
        </section>
      </main>
    </AppLayout>
  );
}
