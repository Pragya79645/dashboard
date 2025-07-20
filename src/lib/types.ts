
export type ContentCategory = 'tech' | 'finance' | 'sports';

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
}
