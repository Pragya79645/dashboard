"use client";

import { SearchParamsWrapper } from "@/components/search-params-wrapper";
import { DashboardHeaderContent } from "@/components/dashboard-header-content";

export function DashboardHeader() {
  return (
    <SearchParamsWrapper fallback={
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex w-full items-center gap-4">
          <h1 className="text-lg font-semibold md:text-xl">Content Canvas</h1>
        </div>
      </header>
    }>
      <DashboardHeaderContent />
    </SearchParamsWrapper>
  );
}
