"use client";

import React from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles } from 'lucide-react';

// Sample movie and news data for testing
const testMovie = {
  id: 550, // Fight Club
  title: "Fight Club",
  overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdrop_path: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  release_date: "1999-10-15",
  vote_average: 8.433,
  vote_count: 26280,
  genre_ids: [18],
  popularity: 61.416,
  adult: false,
  original_language: "en",
  original_title: "Fight Club",
  video: false
};

const testNewsArticle = {
  id: "test-article-1",
  category: "tech" as const,
  title: "Artificial Intelligence Breakthrough: New Model Shows Human-Level Reasoning",
  description: "Researchers have developed a new AI model that demonstrates unprecedented reasoning capabilities, potentially marking a significant milestone in artificial intelligence development.",
  imageUrl: "https://placehold.co/600x400.png",
  author: "Tech News",
  authorImageUrl: "https://placehold.co/40x40.png",
  trending: false,
  link: "#",
  publishedAt: new Date().toISOString(),
  content: "Full article content here..."
};

export default function TestRecommendations() {
  const { 
    addToFavorites, 
    addFavorite, 
    movieRecommendations, 
    newsRecommendations,
    favorites,
    favoriteNews
  } = useFavorites();

  const [loading, setLoading] = React.useState(false);

  const testMovieRecommendations = async () => {
    setLoading(true);
    try {
      await addToFavorites(testMovie);
      console.log('Movie added to favorites, recommendations should be fetched');
    } catch (error) {
      console.error('Error testing movie recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const testNewsRecommendations = async () => {
    setLoading(true);
    try {
      await addFavorite(testNewsArticle);
      console.log('News article added to favorites, recommendations should be fetched');
    } catch (error) {
      console.error('Error testing news recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Test Recommendations Feature
        </h1>
        <p className="text-muted-foreground">
          Test the "you may also like" functionality by adding sample content to favorites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Movie Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎬 Movie Recommendations Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">{testMovie.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {testMovie.overview}
              </p>
              <Badge variant="secondary" className="mt-2">
                Rating: {testMovie.vote_average}/10
              </Badge>
            </div>
            <Button 
              onClick={testMovieRecommendations}
              disabled={loading}
              className="w-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites & Get Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Test News Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📰 News Recommendations Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">{testNewsArticle.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {testNewsArticle.description}
              </p>
              <Badge variant="secondary" className="mt-2">
                Category: {testNewsArticle.category}
              </Badge>
            </div>
            <Button 
              onClick={testNewsRecommendations}
              disabled={loading}
              className="w-full"
            >
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites & Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favorite Movies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{favoriteNews.length}</div>
              <div className="text-sm text-muted-foreground">Favorite News</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{movieRecommendations.length}</div>
              <div className="text-sm text-muted-foreground">Movie Recommendations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{newsRecommendations.length}</div>
              <div className="text-sm text-muted-foreground">News Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-1">
            <li>Click the buttons above to add sample content to your favorites</li>
            <li>The system will automatically fetch recommendations based on the liked content</li>
            <li>Check the "Current Status" section to see recommendation counts</li>
            <li>Visit the <strong>Recommendations</strong> page to see all recommendations</li>
            <li>Go to the <strong>Dashboard</strong> to see recommendations in the main feed</li>
            <li>All recommendations are stored in local storage automatically</li>
          </ol>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Make sure you have configured TMDB_API_KEY and NEWS_API_KEY in your environment variables for the recommendations to work properly.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Quick Start:</strong> Click the buttons above → Check the Dashboard → Visit Recommendations page → Explore suggested content!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
