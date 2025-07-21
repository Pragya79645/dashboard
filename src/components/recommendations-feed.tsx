"use client";

import React from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { MovieCard } from './movie-card';
import { ContentCard } from './content-card';
import { RecommendationsOnboarding } from './recommendations-onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, TrendingUp, Calendar } from 'lucide-react';

interface RecommendationsFeedProps {
  showHeader?: boolean;
  maxMoviesPerSection?: number;
  maxArticlesPerSection?: number;
  showAllRecommendations?: boolean;
  contentType?: 'all' | 'movies' | 'news'; // New prop to filter content type
}

export const RecommendationsFeed: React.FC<RecommendationsFeedProps> = React.memo(({
  showHeader = true,
  maxMoviesPerSection = 4,
  maxArticlesPerSection = 3,
  showAllRecommendations = false,
  contentType = 'all'
}) => {
  const { movieRecommendations, newsRecommendations, favorites, favoriteNews } = useFavorites();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());

  // Calculate total recommendations based on content type
  const totalRecommendations = React.useMemo(() => {
    if (contentType === 'movies') return movieRecommendations.length;
    if (contentType === 'news') return newsRecommendations.length;
    return movieRecommendations.length + newsRecommendations.length;
  }, [movieRecommendations.length, newsRecommendations.length, contentType]);

  const hasAnyFavorites = favorites.length > 0 || favoriteNews.length > 0;

  // Get recent recommendations to show based on contentType
  const recentMovieRecs = React.useMemo(() => {
    if (contentType === 'news') return []; // Don't show movies in news context
    return showAllRecommendations 
      ? movieRecommendations 
      : movieRecommendations.slice(-2); // Show last 2 movie recommendation sets
  }, [movieRecommendations, showAllRecommendations, contentType]);

  const recentNewsRecs = React.useMemo(() => {
    if (contentType === 'movies') return []; // Don't show news in movies context
    return showAllRecommendations 
      ? newsRecommendations 
      : newsRecommendations.slice(-2); // Show last 2 news recommendation sets
  }, [newsRecommendations, showAllRecommendations, contentType]);

  // Check if we should show onboarding based on content type
  const shouldShowOnboarding = React.useMemo(() => {
    if (contentType === 'movies') {
      return favorites.length === 0 || movieRecommendations.length === 0;
    }
    if (contentType === 'news') {
      return favoriteNews.length === 0 || newsRecommendations.length === 0;
    }
    return !hasAnyFavorites || totalRecommendations === 0;
  }, [contentType, favorites.length, favoriteNews.length, movieRecommendations.length, newsRecommendations.length, hasAnyFavorites, totalRecommendations]);

  if (shouldShowOnboarding) {
    return <RecommendationsOnboarding />;
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {contentType === 'news' ? 'You May Also Like' : 
               contentType === 'movies' ? 'Recommended Movies' : 
               'You May Also Like'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {contentType === 'news' 
                ? `Personalized news recommendations based on your ${favoriteNews.length} saved articles`
                : contentType === 'movies'
                ? `Personalized movie recommendations based on your ${favorites.length} favorite movies`
                : `Personalized recommendations based on your ${favorites.length} favorite movies and ${favoriteNews.length} saved articles`
              }
            </p>
          </div>
          {!showAllRecommendations && (
            <Button
              onClick={() => window.location.href = '/recommendations'}
              variant="outline"
              size="sm"
            >
              View All ({totalRecommendations})
            </Button>
          )}
        </div>
      )}

      {/* Movie Recommendations */}
      {recentMovieRecs.map((recommendation, index) => (
        <Card key={recommendation.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                🎬 Similar to "{recommendation.basedOnMovieTitle}"
                <Badge variant="secondary" className="text-xs">
                  {recommendation.movies.length} movies
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(recommendation.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recommendation.movies.slice(0, 
                expandedSections.has(recommendation.id) ? recommendation.movies.length : maxMoviesPerSection
              ).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {recommendation.movies.length > maxMoviesPerSection && !expandedSections.has(recommendation.id) && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setExpandedSections(prev => new Set([...prev, recommendation.id]))}
                  variant="ghost"
                  size="sm"
                >
                  View {recommendation.movies.length - maxMoviesPerSection} more similar movies
                </Button>
              </div>
            )}
            {expandedSections.has(recommendation.id) && recommendation.movies.length > maxMoviesPerSection && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setExpandedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(recommendation.id);
                    return newSet;
                  })}
                  variant="ghost"
                  size="sm"
                >
                  Show fewer movies
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* News Recommendations */}
      {recentNewsRecs.map((recommendation, index) => (
        <Card key={recommendation.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                📰 Related to "{recommendation.basedOnArticleTitle.slice(0, 40)}..."
                <Badge variant="secondary" className="text-xs">
                  {recommendation.articles.length} articles
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(recommendation.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendation.articles.slice(0, 
                expandedSections.has(recommendation.id) ? recommendation.articles.length : maxArticlesPerSection
              ).map((article) => (
                <ContentCard key={article.id} item={article} />
              ))}
            </div>
            {recommendation.articles.length > maxArticlesPerSection && !expandedSections.has(recommendation.id) && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setExpandedSections(prev => new Set([...prev, recommendation.id]))}
                  variant="ghost"
                  size="sm"
                >
                  View {recommendation.articles.length - maxArticlesPerSection} more related articles
                </Button>
              </div>
            )}
            {expandedSections.has(recommendation.id) && recommendation.articles.length > maxArticlesPerSection && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setExpandedSections(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(recommendation.id);
                    return newSet;
                  })}
                  variant="ghost"
                  size="sm"
                >
                  Show fewer articles
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary Section */}
      {(recentMovieRecs.length > 0 || recentNewsRecs.length > 0) && !showAllRecommendations && (
        <>
          <Separator />
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {movieRecommendations.length} movie recommendation sets
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {newsRecommendations.length} article recommendation sets
              </Badge>
            </div>
            <Button
              onClick={() => window.location.href = '/recommendations'}
              className="w-full max-w-md"
            >
              Explore All {totalRecommendations} Recommendation Sets
            </Button>
          </div>
        </>
      )}
    </div>
  );
});
