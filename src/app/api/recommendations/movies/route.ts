import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 }
    );
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Try to get similar movies first
    let url = `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=1`;
    let response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    let data = await response.json();
    
    // If no similar movies found, try recommendations endpoint
    if (!data.results || data.results.length === 0) {
      url = `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&page=1`;
      response = await fetch(url);
      
      if (response.ok) {
        data = await response.json();
      }
    }

    // If still no results, get movie details and find similar by genre
    if (!data.results || data.results.length === 0) {
      // Get movie details to extract genres
      const movieDetailsUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
      const movieDetailsResponse = await fetch(movieDetailsUrl);
      
      if (movieDetailsResponse.ok) {
        const movieDetails = await movieDetailsResponse.json();
        
        if (movieDetails.genres && movieDetails.genres.length > 0) {
          const genreIds = movieDetails.genres.slice(0, 2).map((g: any) => g.id).join(',');
          const discoverUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds}&sort_by=popularity.desc&page=1`;
          
          const discoverResponse = await fetch(discoverUrl);
          if (discoverResponse.ok) {
            data = await discoverResponse.json();
            // Filter out the original movie
            data.results = data.results.filter((movie: any) => movie.id !== parseInt(movieId));
          }
        }
      }
    }

    return NextResponse.json({
      movieId: parseInt(movieId),
      recommendations: data.results ? data.results.slice(0, 10) : [],
      total: data.total_results || 0,
    });

  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie recommendations' },
      { status: 500 }
    );
  }
}
