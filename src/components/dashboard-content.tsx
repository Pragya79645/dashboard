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
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Neobrutalist Hero Section */}
      <div className="relative bg-primary text-primary-foreground p-6 sm:p-8 lg:p-12 border-4 border-border shadow-[12px_12px_0px_0px_rgb(0,0,0)] dark:shadow-[12px_12px_0px_0px_rgb(255,255,255)] overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold uppercase tracking-wide mb-4">
            CONTENT CANVAS
          </h1>
          <p className="text-lg sm:text-xl font-bold uppercase tracking-wider opacity-90 mb-6 max-w-2xl">
            YOUR BRUTALLY HONEST CONTENT DASHBOARD
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" size="lg" className="font-bold uppercase">
              EXPLORE NOW
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold uppercase">
              GET STARTED
            </Button>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-secondary border-4 border-border transform rotate-12"></div>
        <div className="absolute bottom-4 right-16 w-12 h-12 bg-accent border-3 border-border transform -rotate-12"></div>
        <div className="absolute top-1/2 -right-8 w-24 h-24 bg-destructive border-4 border-border transform rotate-45"></div>
      </div>

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
        <div className="flex items-center justify-center p-6 sm:p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm sm:text-base">Loading personalized content...</span>
        </div>
      )}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">TRENDING NOW</h2>
          </div>
          {!loading && (
            <Button variant="outline" size="sm" onClick={refreshNews} className="w-fit">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {trendingItems.map((item, index) => (
              <CarouselItem key={`trending-${item.id}-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ContentCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
      </section>

      {/* Smart Recommendations Section */}
      <RecommendationsFeed />

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">
            {searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'LATEST CONTENT'}
          </h2>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 border-2 border-border">
            {filteredData.length} {filteredData.length === 1 ? 'ITEM' : 'ITEMS'}
          </div>
        </div>
        
        {paginatedData.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedData.map((item, index) => (
                <ContentCard 
                  key={`content-${item.id}-${currentPage}-${index}`} 
                  item={item} 
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground order-first sm:order-none">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-center max-w-md">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {searchQuery 
                  ? `No results for "${searchQuery}".` 
                  : activeCategories.length === 0
                    ? "No content categories selected. Please enable some categories in Settings."
                    : "No content available for the selected categories."
                }
              </p>
              {!searchQuery && activeCategories.length === 0 && (
                <Button variant="outline" onClick={() => window.location.href = '/settings'} className="w-full sm:w-auto">
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
