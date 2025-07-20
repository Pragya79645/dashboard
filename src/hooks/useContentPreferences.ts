import { useSettings } from '../contexts/settings-context';
import { NewsCategory, MovieGenreCategory } from '../lib/types';

export function useContentPreferences() {
  const { settings } = useSettings();

  // Get enabled news categories
  const enabledNewsCategories = Object.entries(settings.news)
    .filter(([, enabled]) => enabled)
    .map(([category]) => category as NewsCategory);

  // Get enabled movie genres
  const enabledMovieGenres = Object.entries(settings.movies)
    .filter(([, enabled]) => enabled)
    .map(([genre]) => genre as MovieGenreCategory);

  // Map movie genre preferences to TMDB genre IDs
  const movieGenreMapping: Record<MovieGenreCategory, number> = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    science_fiction: 878,
    tv_movie: 10770,
    thriller: 53,
    war: 10752,
    western: 37,
  };

  const enabledMovieGenreIds = enabledMovieGenres.map(genre => movieGenreMapping[genre]);

  return {
    news: {
      categories: enabledNewsCategories,
      hasPreferences: enabledNewsCategories.length > 0,
    },
    movies: {
      genres: enabledMovieGenres,
      genreIds: enabledMovieGenreIds,
      hasPreferences: enabledMovieGenres.length > 0,
    },
  };
}
