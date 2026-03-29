"use client";

import { AppLayout } from "@/components/AppLayout";
import StatsGrid from "./components/StatsGrid";
import ZoneTriageList from "./components/ZoneTriageList";

export default function Dashboard() {
  return (
    <AppLayout>
      <main className="flex-1 bg-[#588157] p-8 flex flex-col gap-6 overflow-y-auto">
        <StatsGrid />
        <section className="flex gap-7 mt-4">
          <ZoneTriageList />
        </section>
      </main>
    </AppLayout>
  );
}
