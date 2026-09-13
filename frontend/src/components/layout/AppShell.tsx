import type { ReactNode } from "react";

import Sidebar from "../dashboard/Sidebar";
import TopNavbar from "./TopNavbar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Shared authenticated-page shell.
 * Keeps the page spacing and content width consistent with the dashboard mockup.
 */
export default function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F6FB]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar title={title} subtitle={subtitle} />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
          style={{ backgroundColor: "#F4F6FB" }}
        >
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: "1600px",
              padding: "32px",
            }}
          >
            <div className="flex flex-col" style={{ gap: "26px" }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
