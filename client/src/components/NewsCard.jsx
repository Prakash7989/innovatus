import React from 'react';
import { Clock, Bookmark, BookmarkCheck } from 'lucide-react';
// import type { NewsArticle } from '../types';

// interface NewsCardProps {
//   article: NewsArticle;
//   onSave?: (article: NewsArticle) => void;
// }

export function NewsCard({ article, onSave }) {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'negative': return 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default: return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/90 dark:bg-dark-100/90 
      shadow-lg hover:shadow-xl transition-all duration-300 
      border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transform transition-transform duration-300 
            group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 text-white mb-2">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium 
              ${getSentimentColor(article.sentiment)}`}>
              {article.sentiment || 'neutral'} tone
            </span>
            <span className="text-xs opacity-90">{article.source}</span>
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-white line-clamp-2 mb-2">
            {article.title}
          </h3>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{article.readTime || '5'} min read</span>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => onSave?.(article)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200/50 
                transition-colors group"
            >
              {article.isSaved ? (
                <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 dark:text-primary-300" />
              ) : (
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 
                  group-hover:text-primary-500 dark:group-hover:text-primary-300" />
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 
                text-primary-600 dark:text-primary-300 text-xs sm:text-sm font-medium 
                hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}