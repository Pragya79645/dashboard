"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from '@/contexts/auth-context';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Don't show sidebar for auth pages
  const isAuthPage = pathname?.startsWith('/auth');

  if (!isAuthenticated || isAuthPage) {
    return (
      <main className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-background/80 overflow-auto pt-6">
            <div className="mx-auto max-w-7xl w-full space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
