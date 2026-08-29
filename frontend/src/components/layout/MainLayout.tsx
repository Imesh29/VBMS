import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#F1F3F9]">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <TopNavbar />

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#F1F3F9]">
          {children}
        </main>

      </div>

    </div>
  );
}