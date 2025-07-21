"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
import { Input } from "@/components/ui/input";
import { RefreshCw, AlertCircle, Sparkles, Search, X, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecommendationsFeed } from "@/components/recommendations-feed";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ITEMS_PER_PAGE = 6;

export function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchQuery = searchParams.get('q') || '';
  const { settings } = useSettings();
  const { movieRecommendations, newsRecommendations } = useFavorites();
  
  // Local search state
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  
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

  // Handle search input changes with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value) {
        current.delete("q");
      } else {
        current.set("q", value);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    }, 500);
  };

  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery('');
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("q");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  // Toggle category filter
  const toggleCategory = (category: ContentCategory) => {
    // This would need to be implemented with the settings context
    // For now, we'll just show the current functionality
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Sync local search with URL params
  React.useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    // Combine news articles with mock data for fallback
    const allData = newsArticles.length > 0 ? newsArticles : mockData;
    
    const newFilteredData = allData.filter(item => {
      // Category filter - if no categories are active, show all content
      const categoryMatch = activeCategories.length === 0 || activeCategories.includes(item.category);
      
      // Search filter - search in title, description, and content
      const searchMatch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    });
    
    // Debug logging
    console.log('Dashboard Search Debug:', {
      searchQuery,
      allDataCount: allData.length,
      filteredDataCount: newFilteredData.length,
      activeCategories,
      hasNewsArticles: newsArticles.length > 0,
      sampleTitles: allData.slice(0, 3).map(item => item.title)
    });
    
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

      {/* Enhanced Search Section */}
      <Card className="p-6 border-4 border-border bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/30 dark:via-blue-900/30 dark:to-purple-900/30 shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 text-white rounded-lg border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide">Search Content</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search news, articles, and content..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 h-12 border-3 border-border font-medium"
              />
              {localSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-4 border-3 border-border font-bold uppercase tracking-wide"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Categories ({activeCategories.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
                <div className="space-y-4">
                  <h4 className="font-bold uppercase tracking-wide">Filter by Categories</h4>
                  <div className="text-sm text-muted-foreground">
                    Category filtering is managed in Settings. Active categories are shown below.
                  </div>
                  <div className="space-y-3">
                    {(['tech', 'finance', 'sports', 'business', 'entertainment', 'health', 'science', 'general'] as ContentCategory[]).map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={category}
                          checked={activeCategories.includes(category)}
                          disabled={true}
                        />
                        <Label 
                          htmlFor={category}
                          className="text-sm font-medium capitalize tracking-wide"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/settings')}
                    className="w-full font-bold"
                  >
                    Manage Categories in Settings
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Stats */}
          {searchQuery && (
            <div className="flex items-center gap-2 pt-2">
              <Badge className="bg-green-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                🔍 Search: "{searchQuery}"
              </Badge>
              <Badge variant="outline" className="border-2 border-green-500 text-green-500 font-bold uppercase tracking-wide bg-background">
                {filteredData.length} Results Found
              </Badge>
            </div>
          )}
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
