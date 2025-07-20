import { useState, useEffect } from 'react';
import type { ContentItem, ContentCategory, NewsApiResponse } from '@/lib/types';

interface UseNewsOptions {
  categories: ContentCategory[];
  pageSize?: number;
  refreshInterval?: number;
}

interface UseNewsReturn {
  articles: ContentItem[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
}

export function useNews({ categories, pageSize = 20, refreshInterval }: UseNewsOptions): UseNewsReturn {
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    if (categories.length === 0) {
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching news for categories:', categories);
      
      // Fetch news for each enabled category
      const promises = categories.map(async (category) => {
        const apiCategory = category === 'tech' ? 'technology' : category;
        const url = `/api/news?category=${apiCategory}&pageSize=${Math.ceil(pageSize / categories.length)}`;
        
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch ${category} news:`, response.status, errorText);
          throw new Error(`Failed to fetch ${category} news: ${response.status}`);
        }
        
        const data: NewsApiResponse = await response.json();
        console.log(`Received ${data.articles.length} articles for ${category}:`, data.articles.slice(0, 2));
        
        return data.articles.map(article => ({
          ...article,
          category: category, // Ensure we use our internal category naming
        }));
      });

      const results = await Promise.all(promises);
      const allArticles = results.flat();
      
      console.log('Total articles fetched:', allArticles.length);
      
      // Shuffle articles to mix categories
      const shuffledArticles = allArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, pageSize);

      console.log('Final shuffled articles:', shuffledArticles.length);
      setArticles(shuffledArticles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(errorMessage);
      console.error('Error fetching news:', err);
      
      // Don't show empty state immediately, keep existing articles if any
      if (articles.length === 0) {
        console.log('No existing articles, showing error state');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, [categories.join(','), pageSize]);

  // Set up auto-refresh if specified
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchNews, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, categories.join(',')]);

  return {
    articles,
    loading,
    error,
    refreshNews,
  };
}
