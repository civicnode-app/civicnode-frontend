"use client";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import TimelapseeFeed from "./components/TimelapseeFeed";
import TimelineLog from "./components/TimelineLog";

export default function Dashboard() {
  const demoScore = 0;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="w-full bg-[#588157] p-8 flex flex-col gap-6">
        <DashboardHeader />
        <StatsGrid demoScore={demoScore} />

        <section className="flex gap-7 min-h-105">
          <TimelapseeFeed />
          <TimelineLog />
        </section>
      </main>
    </div>
  );
}
