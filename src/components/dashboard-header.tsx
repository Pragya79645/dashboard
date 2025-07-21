"use client";

import { SearchParamsWrapper } from "@/components/search-params-wrapper";
import { DashboardHeaderContent } from "@/components/dashboard-header-content";

export function DashboardHeader() {
  return (
    <SearchParamsWrapper fallback={
      <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b-4 border-border bg-background px-4 sm:px-6 shadow-[0_4px_0px_0px_rgb(0,0,0)] dark:shadow-[0_4px_0px_0px_rgb(255,255,255)]">
        <div className="flex w-full items-center gap-4">
          <h1 className="text-xl font-bold md:text-2xl uppercase tracking-wide">InfoScope</h1>
        </div>
      </header>
    }>
      <DashboardHeaderContent />
    </SearchParamsWrapper>
  );
}
