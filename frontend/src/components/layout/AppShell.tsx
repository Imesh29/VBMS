import type { ReactNode } from "react";

import Sidebar from "../dashboard/Sidebar";
import TopNavbar from "./TopNavbar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Shared authenticated-page shell: sidebar + top navbar + a
 * scrollable, max-width-constrained content area. Every dashboard
 * page (Dashboard, Vehicles, ...) renders its content inside this.
 */
export default function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F5F7FC]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar title={title} subtitle={subtitle} />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
          style={{
            padding: "15px",
          }}
        >
          <div className="p-8 space-y-7 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
