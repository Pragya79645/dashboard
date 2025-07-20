
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
