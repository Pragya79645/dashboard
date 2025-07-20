import { Movie, ContentItem, MovieRecommendation, NewsRecommendation } from '../lib/types';
import { mockNewsRecommendations } from '../lib/mock-news-recommendations';

export const recommendationsApi = {
  // Get movie recommendations based on a liked movie
  getMovieRecommendations: async (movie: Movie): Promise<MovieRecommendation> => {
    try {
      // Use our internal API route
      const response = await fetch(`/api/recommendations/movies?movieId=${movie.id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: `movie-rec-${movie.id}-${Date.now()}`,
        movies: data.recommendations || [],
        basedOnMovieId: movie.id,
        basedOnMovieTitle: movie.title,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      
      // Return empty recommendation on error
      return {
        id: `movie-rec-${movie.id}-${Date.now()}`,
        movies: [],
        basedOnMovieId: movie.id,
        basedOnMovieTitle: movie.title,
        createdAt: new Date().toISOString(),
      };
    }
  },

  // Get news recommendations based on a liked article
  getNewsRecommendations: async (article: ContentItem): Promise<NewsRecommendation> => {
    console.log('Getting news recommendations for:', article.title);
    
    // Function to get mock recommendations based on category
    const getMockRecommendations = (category: string): ContentItem[] => {
      const categoryKey = category.toLowerCase();
      if (mockNewsRecommendations[categoryKey]) {
        // Return 3 random articles from the category
        const articles = mockNewsRecommendations[categoryKey];
        return articles.slice(0, 3);
      }
      
      // If no specific category, use general category or mix from all
      if (mockNewsRecommendations.general) {
        return mockNewsRecommendations.general.slice(0, 3);
      }
      
      // Fallback: get first 3 from any available category
      const allCategories = Object.values(mockNewsRecommendations);
      if (allCategories.length > 0) {
        return allCategories[0].slice(0, 3);
      }
      
      return [];
    };
    
    try {
      // Use our internal API route
      const response = await fetch(
        `/api/recommendations/news?title=${encodeURIComponent(article.title)}&category=${article.category}`
      );

      console.log('News recommendations API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('News recommendations API error:', errorData);
        
        // Use mock data as fallback
        const mockArticles = getMockRecommendations(article.category);
        console.log('Using mock news recommendations:', mockArticles.length, 'articles');
        
        return {
          id: `news-rec-${article.id}-${Date.now()}`,
          articles: mockArticles,
          basedOnArticleId: article.id,
          basedOnArticleTitle: article.title,
          basedOnCategory: article.category,
          createdAt: new Date().toISOString(),
        };
      }

      const data = await response.json();
      console.log('News recommendations received:', data.recommendations?.length || 0, 'articles');

      // If API returns empty results, use mock data as fallback
      const recommendations = data.recommendations || [];
      if (recommendations.length === 0) {
        const mockArticles = getMockRecommendations(article.category);
        console.log('API returned empty results, using mock news recommendations:', mockArticles.length, 'articles');
        
        return {
          id: `news-rec-${article.id}-${Date.now()}`,
          articles: mockArticles,
          basedOnArticleId: article.id,
          basedOnArticleTitle: article.title,
          basedOnCategory: article.category,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        id: `news-rec-${article.id}-${Date.now()}`,
        articles: recommendations,
        basedOnArticleId: article.id,
        basedOnArticleTitle: article.title,
        basedOnCategory: article.category,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching news recommendations:', error);
      
      // Use mock data as fallback for any error
      const mockArticles = getMockRecommendations(article.category);
      console.log('Error occurred, using mock news recommendations:', mockArticles.length, 'articles');
      
      return {
        id: `news-rec-${article.id}-${Date.now()}`,
        articles: mockArticles,
        basedOnArticleId: article.id,
        basedOnArticleTitle: article.title,
        basedOnCategory: article.category,
        createdAt: new Date().toISOString(),
      };
    }
  },
};
