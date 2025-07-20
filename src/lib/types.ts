
export type ContentCategory = 'tech' | 'finance' | 'sports' | 'business' | 'entertainment' | 'health' | 'science' | 'general';

export interface ContentItem {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  authorImageUrl: string;
  trending?: boolean;
  link: string;
  dataAiHint?: string;
  publishedAt?: string;
  content?: string;
}

export interface NewsApiResponse {
  articles: ContentItem[];
  totalResults: number;
  status: string;
}

// TMDB API Types
export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TMDBMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenresResponse {
  genres: Genre[];
}

export interface TMDBSearchResponse extends TMDBMovieResponse {}

export interface MovieFilters {
  genres: number[];
  year?: number;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
}

export interface MovieState {
  popular: Movie[];
  trending: Movie[];
  upcoming: Movie[];
  topRated: Movie[];
  searchResults: Movie[];
  genres: Genre[];
  filters: MovieFilters;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}
