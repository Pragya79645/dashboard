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
      <div className="text-center space-y-2 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-muted-foreground text-sm sm:text-base">All your saved content in one place</p>
      </div>

      {favoriteNewsItems.length === 0 && favoriteMovies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4 mx-4 sm:mx-0">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
          <h3 className="text-lg sm:text-xl font-semibold">No Favorites Yet</h3>
          <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md">
            Click the heart icon on any content card or movie to save it here.
          </p>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 sm:mx-0">
            <TabsTrigger value="all" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">All</span>
              <Badge variant="secondary" className="text-xs">{favoriteNewsItems.length + favoriteMovies.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">News</span>
              <Badge variant="secondary" className="text-xs">{favoriteNewsItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Film className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Movies</span>
              <Badge variant="secondary" className="text-xs">{favoriteMovies.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 px-4 sm:px-0">
            <div className="space-y-6 sm:space-y-8">
              {favoriteMovies.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Favorite Movies</h2>
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
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Favorite News</h2>
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
              <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4">
                <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
                <h3 className="text-lg sm:text-xl font-semibold">No Favorite News</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  Save news articles from the dashboard to see them here.
                </p>
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
              <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4">
                <Film className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
                <h3 className="text-lg sm:text-xl font-semibold">No Favorite Movies</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  Save movies from the Movies page to see them here.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Recommendations Section */}
      {(favoriteMovies.length > 0 || favoriteNewsItems.length > 0) && (
        <div className="space-y-6 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-base sm:text-xl">Recommendations Based on Your Favorites</span>
            </h2>
            <Button
              onClick={() => window.location.href = '/recommendations'}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              View All Recommendations
            </Button>
          </div>

          {/* Show recommendations for recent favorites */}
          {favoriteMovies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Similar Movies</h3>
              <RecommendationsDisplay 
                movieId={favoriteMovies[favoriteMovies.length - 1].id}
                maxItems={6}
                showTitle={false}
              />
            </div>
          )}

          {favoriteNewsItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Related Articles</h3>
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
