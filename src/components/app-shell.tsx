"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <MainSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/80">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
