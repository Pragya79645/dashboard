import axios from 'axios';
import { TMDBMovieResponse, TMDBGenresResponse, MovieFilters } from '../lib/types';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  throw new Error('TMDB API key is not configured');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    const response = await axiosInstance.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get trending movies (daily)
  getTrendingMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    const response = await axiosInstance.get('/trending/movie/day', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    const response = await axiosInstance.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<TMDBMovieResponse> => {
    const response = await axiosInstance.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBMovieResponse> => {
    const response = await axiosInstance.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movie genres
  getGenres: async (): Promise<TMDBGenresResponse> => {
    const response = await axiosInstance.get('/genre/movie/list');
    return response.data;
  },

  // Discover movies with filters
  discoverMovies: async (filters: MovieFilters, page: number = 1): Promise<TMDBMovieResponse> => {
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
  },

  // Get movie details (for future use)
  getMovieDetails: async (movieId: number) => {
    const response = await axiosInstance.get(`/movie/${movieId}`);
    return response.data;
  },
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
