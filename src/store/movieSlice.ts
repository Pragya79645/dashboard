import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, TMDBMovieResponse, TMDBGenresResponse, MovieState, MovieFilters } from '../lib/types';
import { tmdbApi } from '../services/tmdbApi';

// Helper function to merge movies without duplicates
const mergeMoviesUnique = (existing: Movie[], newMovies: Movie[]): Movie[] => {
  const existingIds = new Set(existing.map(movie => movie.id));
  const uniqueNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
  return [...existing, ...uniqueNewMovies];
};

// Async thunks for API calls
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page: number = 1) => {
    return await tmdbApi.getPopularMovies(page);
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (page: number = 1) => {
    return await tmdbApi.getTrendingMovies(page);
  }
);

export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcoming',
  async (page: number = 1) => {
    return await tmdbApi.getUpcomingMovies(page);
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async (page: number = 1) => {
    return await tmdbApi.getTopRatedMovies(page);
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page }: { query: string; page: number }) => {
    return await tmdbApi.searchMovies(query, page);
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async () => {
    return await tmdbApi.getGenres();
  }
);

export const discoverMovies = createAsyncThunk(
  'movies/discover',
  async ({ filters, page }: { filters: MovieFilters; page: number }) => {
    return await tmdbApi.discoverMovies(filters, page);
  }
);

const initialState: MovieState = {
  popular: [],
  trending: [],
  upcoming: [],
  topRated: [],
  searchResults: [],
  genres: [],
  filters: {
    genres: [],
    sortBy: 'popularity.desc',
  },
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<MovieFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Popular movies
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 1) {
          state.popular = action.payload.results;
        } else {
          state.popular = mergeMoviesUnique(state.popular, action.payload.results);
        }
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch popular movies';
      });

    // Trending movies
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 1) {
          state.trending = action.payload.results;
        } else {
          state.trending = mergeMoviesUnique(state.trending, action.payload.results);
        }
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending movies';
      });

    // Upcoming movies
    builder
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 1) {
          state.upcoming = action.payload.results;
        } else {
          state.upcoming = mergeMoviesUnique(state.upcoming, action.payload.results);
        }
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch upcoming movies';
      });

    // Top rated movies
    builder
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 1) {
          state.topRated = action.payload.results;
        } else {
          state.topRated = mergeMoviesUnique(state.topRated, action.payload.results);
        }
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch top rated movies';
      });

    // Search movies
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.searchResults = action.payload.results;
        } else {
          state.searchResults = mergeMoviesUnique(state.searchResults, action.payload.results);
        }
        state.totalPages = action.payload.total_pages;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search movies';
      });

    // Genres
    builder
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload.genres;
      });

    // Discover movies (filtered)
    builder
      .addCase(discoverMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discoverMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.searchResults = action.payload.results;
        } else {
          state.searchResults = mergeMoviesUnique(state.searchResults, action.payload.results);
        }
        state.totalPages = action.payload.total_pages;
      })
      .addCase(discoverMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to discover movies';
      });
  },
});

export const { setFilters, setSearchQuery, clearSearchResults, setCurrentPage } = movieSlice.actions;
export default movieSlice.reducer;
