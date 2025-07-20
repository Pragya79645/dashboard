import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleTitle = searchParams.get('title');
  const category = searchParams.get('category') || 'general';

  console.log('News recommendations API called with:', { articleTitle, category });

  if (!articleTitle) {
    return NextResponse.json(
      { error: 'Article title is required' },
      { status: 400 }
    );
  }

  if (!NEWS_API_KEY) {
    console.error('News API key not configured');
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Extract keywords from the article title for search
    const keywords = articleTitle
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(' OR ');

    // Search for similar articles using keywords
    let url = `${NEWS_API_BASE_URL}/everything?` +
      `q=${encodeURIComponent(keywords)}&` +
      `language=en&` +
      `sortBy=relevancy&` +
      `pageSize=10&` +
      `apiKey=${NEWS_API_KEY}`;

    let response = await fetch(url, {
      headers: {
        'User-Agent': 'PersonalizedDashboard/1.0',
      },
    });

    if (!response.ok) {
      // Fallback: get articles from the same category
      url = `${NEWS_API_BASE_URL}/top-headlines?` +
        `category=${category}&` +
        `country=us&` +
        `pageSize=10&` +
        `apiKey=${NEWS_API_KEY}`;

      response = await fetch(url, {
        headers: {
          'User-Agent': 'PersonalizedDashboard/1.0',
        },
      });
    }

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the API response to match our ContentItem interface
    const transformedArticles = data.articles?.map((article: any) => ({
      id: article.url || Math.random().toString(36).substr(2, 9),
      category: category,
      title: article.title || 'No title',
      description: article.description || 'No description available',
      imageUrl: article.urlToImage || 'https://placehold.co/600x400.png',
      author: article.source?.name || 'Unknown Source',
      authorImageUrl: 'https://placehold.co/40x40.png',
      trending: false,
      link: article.url || '#',
      publishedAt: article.publishedAt,
      content: article.content,
    })) || [];

    // Filter out articles with the same title (to avoid showing the original article)
    const filteredArticles = transformedArticles.filter(
      (article: any) => article.title.toLowerCase() !== articleTitle.toLowerCase()
    );

    return NextResponse.json({
      basedOnTitle: articleTitle,
      category: category,
      recommendations: filteredArticles.slice(0, 10),
      total: data.totalResults || 0,
    });

  } catch (error) {
    console.error('Error fetching news recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news recommendations' },
      { status: 500 }
    );
  }
}
