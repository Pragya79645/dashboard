"use client";

import React from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { MovieCard } from './movie-card';
import { ContentCard } from './content-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sparkles } from 'lucide-react';

// Enhanced component to show actual recommendations with carousel
export const SimpleRecommendationsDisplay: React.FC = React.memo(() => {
  const { movieRecommendations, newsRecommendations } = useFavorites();

  const latestMovieRec = React.useMemo(() => 
    movieRecommendations.length > 0 ? movieRecommendations[movieRecommendations.length - 1] : null,
    [movieRecommendations]
  );

  const latestNewsRec = React.useMemo(() => 
    newsRecommendations.length > 0 ? newsRecommendations[newsRecommendations.length - 1] : null,
    [newsRecommendations]
  );

  const totalRecommendations = movieRecommendations.length + newsRecommendations.length;

  if (totalRecommendations === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          You May Also Like
          <Badge variant="secondary" className="text-xs">
            {totalRecommendations} total recommendations
          </Badge>
        </h2>
        <Button
          onClick={() => window.location.href = '/recommendations'}
          variant="outline"
          size="sm"
        >
          View All
        </Button>
      </div>

      {/* Movie Recommendations Carousel */}
      {latestMovieRec && latestMovieRec.movies.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              🎬 Similar Movies
              <Badge variant="outline" className="text-xs">
                Based on "{latestMovieRec.basedOnMovieTitle}"
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {latestMovieRec.movies.slice(0, 8).map((movie) => (
                  <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                    <div className="p-1">
                      <MovieCard movie={movie} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </CardContent>
        </Card>
      )}

      {/* News Recommendations Carousel */}
      {latestNewsRec && latestNewsRec.articles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📰 Related Articles
              <Badge variant="outline" className="text-xs">
                Based on "{latestNewsRec.basedOnArticleTitle.slice(0, 30)}..."
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {latestNewsRec.articles.slice(0, 6).map((article) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <ContentCard item={article} isCarouselItem={true} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </CardContent>
        </Card>
      )}

      {/* Show recommendations from multiple favorites if available */}
      {movieRecommendations.length > 1 || newsRecommendations.length > 1 ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            You have recommendations from {movieRecommendations.length} movies and {newsRecommendations.length} articles
          </p>
          <Button 
            onClick={() => window.location.href = '/recommendations'}
            variant="outline"
          >
            View All {totalRecommendations} Recommendations
          </Button>
        </div>
      ) : null}
    </section>
  );
});
