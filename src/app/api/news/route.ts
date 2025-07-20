import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '20';
  const country = searchParams.get('country') || 'us';

  if (!NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `${NEWS_API_BASE_URL}/top-headlines?` +
      `country=${country}&` +
      `category=${category}&` +
      `page=${page}&` +
      `pageSize=${pageSize}&` +
      `apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PersonalizedDashboard/1.0',
      },
    });

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

    return NextResponse.json({
      articles: transformedArticles,
      totalResults: data.totalResults || 0,
      status: data.status || 'ok',
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}
