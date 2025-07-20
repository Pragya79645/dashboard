"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { mockData } from "@/lib/mock-data";
import { ContentCard } from "@/components/content-card";
import { MovieCard } from "@/components/movie-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Film, Newspaper } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  
  // Get favorite news items (existing functionality)
  const favoriteNewsIds = favorites.filter(fav => typeof fav === 'string') as string[];
  const favoriteNewsItems = mockData.filter(item => favoriteNewsIds.includes(item.id));
  
  // Get favorite movies (new functionality)
  const favoriteMovies = favorites.filter(fav => typeof fav === 'object') as any[];

  const handleRemoveFromFavorites = (movieId: number) => {
    // This will be handled by the MovieCard component
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-muted-foreground">All your saved content in one place</p>
      </div>

      {favoriteNewsItems.length === 0 && favoriteMovies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 space-y-4">
          <Heart className="w-16 h-16 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold">No Favorites Yet</h3>
          <p className="text-muted-foreground text-center">
            Click the heart icon on any content card or movie to save it here.
          </p>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              All
              <Badge variant="secondary">{favoriteNewsItems.length + favoriteMovies.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              News
              <Badge variant="secondary">{favoriteNewsItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Movies
              <Badge variant="secondary">{favoriteMovies.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-8">
              {favoriteMovies.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Favorite Movies</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favoriteMovies.map(movie => (
                      <MovieCard
                        key={movie.id}
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
                  <h2 className="text-xl font-semibold mb-4">Favorite News</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteNewsItems.map(item => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            {favoriteNewsItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteNewsItems.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 space-y-4">
                <Newspaper className="w-16 h-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">No Favorite News</h3>
                <p className="text-muted-foreground text-center">
                  Save news articles from the dashboard to see them here.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            {favoriteMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favoriteMovies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={true}
                    onAddToFavorites={handleRemoveFromFavorites}
                  />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 space-y-4">
                <Film className="w-16 h-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">No Favorite Movies</h3>
                <p className="text-muted-foreground text-center">
                  Save movies from the Movies page to see them here.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
