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
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="p-8 border-4 border-border bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] mx-4 sm:mx-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 text-white rounded-lg border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-wider text-foreground uppercase leading-none">
                  Content
                </h1>
                <h2 className="text-2xl font-bold tracking-wide text-blue-500 uppercase">
                  Dashboard
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground font-bold text-lg uppercase tracking-wide">
              Your personalized content discovery center
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                📊 {filteredData.length} Items Available
              </Badge>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold uppercase tracking-wide">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Loading Latest Content...
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-500 font-bold uppercase tracking-wide bg-background"
              >
                🔥 {trendingItems.length} Trending
              </Badge>
              <Badge 
                variant="outline" 
                className="border-2 border-purple-500 text-purple-500 font-bold uppercase tracking-wide bg-background"
              >
                📰 {newsArticles.length} News
              </Badge>
              <Badge 
                variant="outline" 
                className="border-2 border-indigo-500 text-indigo-500 font-bold uppercase tracking-wide bg-background"
              >
                ⭐ {activeCategories.length} Categories
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-4 border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {error} - Showing fallback content.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8 sm:p-12">
          <RefreshCw className="h-6 w-6 animate-spin mr-3" />
          <span className="text-sm sm:text-base font-medium">Loading personalized content...</span>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide">TRENDING NOW</h2>
          </div>
          {!loading && (
            <Button variant="outline" size="sm" onClick={refreshNews} className="w-fit font-bold">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-3 md:-ml-4">
            {trendingItems.map((item, index) => (
              <CarouselItem key={`trending-${item.id}-${index}`} className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ContentCard item={item} isCarouselItem={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
      </section>

      {/* Smart Recommendations Section */}
      <RecommendationsFeed contentType="news" />

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide">
            {searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'LATEST CONTENT'}
          </h2>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground bg-muted px-4 py-2 border-3 border-border rounded-sm">
            {filteredData.length} {filteredData.length === 1 ? 'ITEM' : 'ITEMS'}
          </div>
        </div>
        
        {paginatedData.length > 0 ? (
          <>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedData.map((item, index) => (
                <ContentCard 
                  key={`content-${item.id}-${currentPage}-${index}`} 
                  item={item} 
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-10 pt-6 border-t border-border/30">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="w-full sm:w-auto font-bold"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground order-first sm:order-none font-medium bg-muted px-3 py-1 border-2 border-border rounded-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="w-full sm:w-auto font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="flex items-center justify-center p-8 sm:p-12 border-4 border-border">
            <div className="text-center max-w-md space-y-4">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base font-medium">
                {searchQuery 
                  ? `No results for "${searchQuery}".` 
                  : activeCategories.length === 0
                    ? "No content categories selected. Please enable some categories in Settings."
                    : "No content available for the selected categories."
                }
              </p>
              {!searchQuery && activeCategories.length === 0 && (
                <Button variant="outline" onClick={() => window.location.href = '/settings'} className="w-full sm:w-auto font-bold">
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
