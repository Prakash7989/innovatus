export interface Document {
    id: string;
    name: string;
    type: string;
    category: string;
    categoryColor?: string;
    tags: string[];
    summary?: string;
    highlights?: string[];
    uploadDate: Date;
  }
  
  export interface Category {
    id: string;
    name: string;
    color: string;
  }
  
  export type Theme = 'light' | 'dark';
  
  export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    date: Date;
    source: string;
    url: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    readTime?: number;
    isSaved?: boolean;
  }
  
  export interface NewsPreference {
    id: string;
    topic: string;
    enabled: boolean;
  }
  
  export type AppRoute = 'documents' | 'news' | 'saved';