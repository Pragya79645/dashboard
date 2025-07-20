"use client";

import { SearchParamsWrapper } from "@/components/search-params-wrapper";
import { DashboardContent } from "@/components/dashboard-content";

export default function DashboardPage() {
  return (
    <SearchParamsWrapper fallback={
      <div className="flex items-center justify-center p-8">
        <div>Loading dashboard...</div>
      </div>
    }>
      <DashboardContent />
    </SearchParamsWrapper>
  );
}
