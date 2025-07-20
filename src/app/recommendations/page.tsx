"use client";

import React from 'react';
import { RecommendationsFeed } from '@/components/recommendations-feed';

export default function RecommendationsPage() {
  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Recommendations</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover movies and articles based on your favorites
        </p>
      </div>
      <RecommendationsFeed 
        showHeader={false}
        showAllRecommendations={true}
        maxMoviesPerSection={8}
        maxArticlesPerSection={6}
      />
    </div>
  );
}
