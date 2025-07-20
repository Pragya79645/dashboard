import axios, { AxiosError } from 'axios';
import { TMDBMovieResponse, TMDBGenresResponse, MovieFilters } from '../lib/types';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  console.error('TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  throw new Error('TMDB API key is not configured. Please check your environment variables.');
}

// Create axios instance with better configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  params: {
    api_key: API_KEY,
  },
});

// Add request interceptor for retry logic with exponential backoff
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    
    // Retry logic for network errors and 5xx errors
    if (
      config &&
      (!config._retryCount || config._retryCount < 3) &&
      (error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NETWORK' ||
       error.code === 'ERR_CONNECTION_TIMED_OUT' ||
       (error.response && error.response.status >= 500))
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Exponential backoff: wait 1s, 2s, 4s
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Retrying request (attempt ${config._retryCount}/3) after ${delay}ms delay`);
      
      return axiosInstance(config);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: any, fallbackMessage: string) => {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CONNECTION_TIMED_OUT') {
    throw new Error('Request timed out. Please check your internet connection and try again.');
  }
  
  if (error.code === 'ERR_NETWORK') {
    throw new Error('Network error. Please check your internet connection.');
  }
  
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      throw new Error('API authentication failed. Please check your API key.');
    } else if (status === 404) {
      throw new Error('Resource not found.');
    } else if (status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else if (status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
  }
  
  throw new Error(fallbackMessage);
};

export const tmdbApi = {
  // Test API connectivity
  testConnection: async (): Promise<boolean> => {
    try {
      await axiosInstance.get('/configuration', { timeout: 5000 });
      return true;
    } catch (error) {
      console.error('TMDB API connection test failed:', error);
      return false;
    }
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      const response = await axiosInstance.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch popular movies');
      throw error; // This won't be reached due to handleApiError throwing
    }
  },

  // Get trending movies (daily)
  getTrendingMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      const response = await axiosInstance.get('/trending/movie/day', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch trending movies');
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      const response = await axiosInstance.get('/movie/upcoming', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch upcoming movies');
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      const response = await axiosInstance.get('/movie/top_rated', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch top rated movies');
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      console.log('API call: searching for', query, 'page', page);
      const response = await axiosInstance.get('/search/movie', {
        params: { query, page },
      });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      handleApiError(error, 'Failed to search movies');
      throw error;
    }
  },

  // Get movie genres
  getGenres: async (): Promise<TMDBGenresResponse> => {
    try {
      const response = await axiosInstance.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch genres');
      throw error;
    }
  },

  // Discover movies with filters
  discoverMovies: async (filters: MovieFilters, page: number = 1): Promise<TMDBMovieResponse> => {
    try {
      const params: any = { page };
      
      if (filters.genres.length > 0) {
        params.with_genres = filters.genres.join(',');
      }
      
      if (filters.year) {
        params.year = filters.year;
      }
      
      if (filters.sortBy) {
        params.sort_by = filters.sortBy;
      }

      const response = await axiosInstance.get('/discover/movie', {
        params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to discover movies');
      throw error;
    }
  },

  // Get movie details (for future use)
  getMovieDetails: async (movieId: number) => {
    try {
      const response = await axiosInstance.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch movie details');
      throw error;
    }
  },
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
