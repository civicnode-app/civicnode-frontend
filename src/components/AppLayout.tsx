import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { SimulationProvider } from "@/components/SimulationProvider";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SimulationProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          {children}
        </div>
      </div>
    </SimulationProvider>
  );
}
