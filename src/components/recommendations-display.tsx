"use client";

import React from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { MovieCard } from './movie-card';
import { ContentCard } from './content-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface RecommendationsDisplayProps {
  movieId?: number;
  articleId?: string;
  showTitle?: boolean;
  maxItems?: number;
}

export const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = React.memo(({
  movieId,
  articleId,
  showTitle = true,
  maxItems = 5
}) => {
  const { getRecommendationsForMovie, getRecommendationsForNews } = useFavorites();

  const movieRecommendations = React.useMemo(() => 
    movieId ? getRecommendationsForMovie(movieId) : undefined,
    [movieId, getRecommendationsForMovie]
  );
  
  const newsRecommendations = React.useMemo(() => 
    articleId ? getRecommendationsForNews(articleId) : undefined,
    [articleId, getRecommendationsForNews]
  );

  if (!movieRecommendations && !newsRecommendations) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        {showTitle && (
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            ✨ You may also like
            <Badge variant="secondary" className="text-xs">
              {movieRecommendations ? 'Movies' : 'News'}
            </Badge>
          </CardTitle>
        )}
        {movieRecommendations && (
          <p className="text-sm text-muted-foreground">
            Based on your interest in "{movieRecommendations.basedOnMovieTitle}"
          </p>
        )}
        {newsRecommendations && (
          <p className="text-sm text-muted-foreground">
            Based on your interest in "{newsRecommendations.basedOnArticleTitle}"
          </p>
        )}
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <ScrollArea className="w-full">
          {movieRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {movieRecommendations.movies.slice(0, maxItems).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          {newsRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsRecommendations.articles.slice(0, maxItems).map((article) => (
                <ContentCard key={article.id} item={article} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

// Component to show all recommendations
export const AllRecommendations: React.FC = React.memo(() => {
  const { movieRecommendations, newsRecommendations } = useFavorites();

  const hasRecommendations = React.useMemo(() => 
    movieRecommendations.length > 0 || newsRecommendations.length > 0,
    [movieRecommendations.length, newsRecommendations.length]
  );

  if (!hasRecommendations) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium mb-2">No recommendations yet</p>
            <p className="text-sm">Add some movies or news articles to your favorites to get personalized recommendations!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {movieRecommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Movie Recommendations</h2>
          {movieRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  Based on "{recommendation.basedOnMovieTitle}"
                  <Badge variant="outline" className="text-xs">
                    {recommendation.movies.length} movies
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Added {new Date(recommendation.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {recommendation.movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {newsRecommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">News Recommendations</h2>
          {newsRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  Based on "{recommendation.basedOnArticleTitle}"
                  <Badge variant="outline" className="text-xs">
                    {recommendation.articles.length} articles
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Added {new Date(recommendation.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendation.articles.map((article) => (
                      <ContentCard key={article.id} item={article} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
