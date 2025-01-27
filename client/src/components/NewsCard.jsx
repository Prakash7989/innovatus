import React from 'react';
// import type { NewsArticle } from '../types';

// interface NewsCardProps {
//   article: NewsArticle;
// }

export function NewsCard({ article }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-100 
      shadow-lg hover:shadow-xl transition-all duration-300 
      border border-gray-200 dark:border-gray-700">
      <div className="aspect-video overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transform transition-transform duration-300 
            group-hover:scale-105"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium 
            bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300">
            {article.category}
          </span>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {new Date(article.date).toLocaleDateString()} • {article.source}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {article.description}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-primary-600 dark:text-primary-300 
            font-medium hover:underline"
        >
          Read more
        </a>
      </div>
    </div>
  );
}