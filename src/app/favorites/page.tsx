"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { ContentCard } from "@/components/content-card";
import { MovieCard } from "@/components/movie-card";
import { RecommendationsDisplay } from "@/components/recommendations-display";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Film, Newspaper, Sparkles } from "lucide-react";
import { Movie } from "@/lib/types";

export default function FavoritesPage() {
  const { favorites, favoriteNews, removeFromFavorites } = useFavorites();
  
  // Get favorite news items (now using the dedicated favoriteNews array)
  const favoriteNewsItems = favoriteNews;
  
  // Get favorite movies (existing functionality)
  const favoriteMovies = favorites;

  const handleRemoveFromFavorites = (movie: Movie) => {
    removeFromFavorites(movie.id);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="p-8 border-4 border-border bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 dark:from-red-950 dark:via-pink-950 dark:to-rose-950 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] mx-4 sm:mx-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 text-white rounded-lg border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-wider text-foreground uppercase leading-none">
                  Your
                </h1>
                <h2 className="text-2xl font-bold tracking-wide text-red-500 uppercase">
                  Favorites
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground font-bold text-lg uppercase tracking-wide">
              All your saved content & loved movies in one place
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                ❤️ {favoriteNewsItems.length + favoriteMovies.length} Items Saved
              </Badge>
            </div>
            {(favoriteNewsItems.length > 0 || favoriteMovies.length > 0) && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Badge 
                  variant="outline" 
                  className="border-2 border-red-500 text-red-500 font-bold uppercase tracking-wide bg-background"
                >
                  🎬 {favoriteMovies.length} Movies
                </Badge>
                <Badge 
                  variant="outline" 
                  className="border-2 border-pink-500 text-pink-500 font-bold uppercase tracking-wide bg-background"
                >
                  📰 {favoriteNewsItems.length} Articles
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>

      {favoriteNewsItems.length === 0 && favoriteMovies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-6 mx-4 sm:mx-0 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-gray-50 via-background to-gray-50 dark:from-gray-950 dark:to-gray-950">
          <div className="p-6 bg-red-500 text-white rounded-full border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide">No Favorites Yet</h3>
            <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md font-bold uppercase tracking-wide">
              Click the heart icon on any content card or movie to save it here
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.location.href = '/movies'}
              className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all bg-red-500 hover:bg-red-600 text-white"
            >
              🎬 Browse Movies
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
            >
              📰 Discover News
            </Button>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <Card className="p-6 border-4 border-border bg-gradient-to-r from-background via-primary/5 to-background mx-4 sm:mx-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary text-primary-foreground rounded border-2 border-border">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-xl uppercase tracking-wide text-foreground">
                  Filter Your Collection
                </h3>
              </div>
              <TabsList className="grid w-full grid-cols-3 border-4 border-border bg-muted shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                <TabsTrigger 
                  value="all" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">All</span>
                  <Badge variant="secondary" className="text-xs font-bold">{favoriteNewsItems.length + favoriteMovies.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="news" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold uppercase tracking-wide data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)]"
                >
                  <Newspaper className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">News</span>
                  <Badge variant="secondary" className="text-xs font-bold">{favoriteNewsItems.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="movies" 
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold uppercase tracking-wide data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)]"
                >
                  <Film className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Movies</span>
                  <Badge variant="secondary" className="text-xs font-bold">{favoriteMovies.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </Card>

          <TabsContent value="all" className="mt-6 px-4 sm:px-0">
            <div className="space-y-6 sm:space-y-8">
              {favoriteMovies.length > 0 && (
                <div>
                  <Card className="p-4 border-4 border-border bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500 text-white rounded border-2 border-border">
                        <Film className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-foreground">
                        Favorite Movies
                      </h2>
                      <Badge className="bg-red-500 text-white border-2 border-border font-bold">
                        {favoriteMovies.length}
                      </Badge>
                    </div>
                  </Card>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                    {favoriteMovies.map((movie, index) => (
                      <MovieCard
                        key={`favorite-movie-${movie.id}-${index}`}
                        movie={movie}
                        isFavorite={true}
                        onAddToFavorites={handleRemoveFromFavorites}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {favoriteNewsItems.length > 0 && (
                <div>
                  <Card className="p-4 border-4 border-border bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500 text-white rounded border-2 border-border">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-foreground">
                        Favorite News
                      </h2>
                      <Badge className="bg-pink-500 text-white border-2 border-border font-bold">
                        {favoriteNewsItems.length}
                      </Badge>
                    </div>
                  </Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {favoriteNewsItems.map(item => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6 px-4 sm:px-0">
            {favoriteNewsItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {favoriteNewsItems.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-pink-50 via-background to-pink-50 dark:from-pink-950 dark:to-pink-950">
                <div className="p-4 bg-pink-500 text-white rounded-full border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
                  <Newspaper className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide">No Favorite News</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base font-bold uppercase tracking-wide">
                  Save news articles from the dashboard to see them here
                </p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all bg-pink-500 hover:bg-pink-600 text-white"
                >
                  📰 Discover News
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="movies" className="mt-6 px-4 sm:px-0">
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {favoriteMovies.map((movie, index) => (
                  <MovieCard
                    key={`favorite-movies-tab-${movie.id}-${index}`}
                    movie={movie}
                    isFavorite={true}
                    onAddToFavorites={handleRemoveFromFavorites}
                  />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-red-50 via-background to-red-50 dark:from-red-950 dark:to-red-950">
                <div className="p-4 bg-red-500 text-white rounded-full border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
                  <Film className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide">No Favorite Movies</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base font-bold uppercase tracking-wide">
                  Save movies from the Movies page to see them here
                </p>
                <Button 
                  onClick={() => window.location.href = '/movies'}
                  className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all bg-red-500 hover:bg-red-600 text-white"
                >
                  🎬 Browse Movies
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Recommendations Section */}
      {(favoriteMovies.length > 0 || favoriteNewsItems.length > 0) && (
        <div className="space-y-6 px-4 sm:px-0">
          <Card className="p-6 border-4 border-border bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 text-white rounded-lg border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-wide text-foreground uppercase leading-none">
                    Smart
                  </h2>
                  <h3 className="text-lg font-bold tracking-wide text-purple-500 uppercase">
                    Recommendations
                  </h3>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/recommendations'}
                className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
              >
                ✨ View All Recommendations
              </Button>
            </div>
          </Card>

          {/* Show recommendations for recent favorites */}
          {favoriteMovies.length > 0 && (
            <div className="space-y-4">
              <Card className="p-4 border-4 border-border bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 text-white rounded border-2 border-border">
                    <Film className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                    Similar Movies
                  </h3>
                  <Badge className="bg-orange-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                    Based on your taste
                  </Badge>
                </div>
              </Card>
              <RecommendationsDisplay 
                movieId={favoriteMovies[favoriteMovies.length - 1].id}
                maxItems={6}
                showTitle={false}
              />
            </div>
          )}

          {favoriteNewsItems.length > 0 && (
            <div className="space-y-4">
              <Card className="p-4 border-4 border-border bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500 text-white rounded border-2 border-border">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-foreground">
                    Related Articles
                  </h3>
                  <Badge className="bg-cyan-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                    Personalized for you
                  </Badge>
                </div>
              </Card>
              <RecommendationsDisplay 
                articleId={favoriteNewsItems[favoriteNewsItems.length - 1].id}
                maxItems={6}
                showTitle={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
