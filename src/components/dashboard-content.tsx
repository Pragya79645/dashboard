"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';
import { ContentCard } from "@/components/content-card";
import { mockData } from "@/lib/mock-data";
import type { ContentItem, ContentCategory } from "@/lib/types";
import { useSettings } from "@/contexts/settings-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useNews } from "@/hooks/use-news";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecommendationsFeed } from "@/components/recommendations-feed";

const ITEMS_PER_PAGE = 6;

export function DashboardContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { settings } = useSettings();
  const { movieRecommendations, newsRecommendations } = useFavorites();
  
  // Get active categories from settings (backward compatibility)
  const activeCategories = React.useMemo(() => {
    // Use the content settings for existing functionality
    const contentSettings = settings.content || {};
    return Object.entries(contentSettings)
      .filter(([, value]) => value)
      .map(([key]) => key as ContentCategory);
  }, [settings]);

  // Fetch news based on active categories
  const { articles: newsArticles, loading, error, refreshNews } = useNews({
    categories: activeCategories,
    pageSize: 30,
    refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const [filteredData, setFilteredData] = React.useState<ContentItem[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    // Combine news articles with mock data for fallback
    const allData = newsArticles.length > 0 ? newsArticles : mockData;
    
    const newFilteredData = allData.filter(item =>
      (activeCategories.length === 0 || activeCategories.includes(item.category)) &&
      (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(newFilteredData);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, settings, newsArticles, activeCategories]);

  // Use trending from mock data as fallback, or recent news articles
  const trendingItems = React.useMemo(() => {
    // If we have news articles, use the most recent ones as trending
    if (newsArticles.length > 0) {
      return newsArticles.slice(0, 6).map(article => ({
        ...article,
        trending: true, // Mark as trending for display purposes
      }));
    }
    
    // Fallback to mock data if no news articles are available
    const trending = mockData.filter(item => item.trending);
    return trending.length > 0 ? trending : mockData.slice(0, 6);
  }, [newsArticles]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error} - Showing fallback content.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading personalized content...</span>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Trending Now</h2>
          </div>
          {!loading && (
            <Button variant="outline" size="sm" onClick={refreshNews}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {trendingItems.map((item, index) => (
              <CarouselItem key={`trending-${item.id}-${index}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <ContentCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </section>

      {/* Smart Recommendations Section */}
      <RecommendationsFeed />

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Content'}
          </h2>
          <div className="text-sm text-muted-foreground">
            {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'}
          </div>
        </div>
        
        {paginatedData.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedData.map((item, index) => (
                <ContentCard 
                  key={`content-${item.id}-${currentPage}-${index}`} 
                  item={item} 
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No results for "${searchQuery}".` 
                  : activeCategories.length === 0
                    ? "No content categories selected. Please enable some categories in Settings."
                    : "No content available for the selected categories."
                }
              </p>
              {!searchQuery && activeCategories.length === 0 && (
                <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                  Go to Settings
                </Button>
              )}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
