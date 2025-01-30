import React from 'react';
import { Clock, Bookmark, BookmarkCheck } from 'lucide-react';

export function NewsCard({ article, onSave }) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl group">
      <div className="relative w-full h-[450px] sm:h-[550px]">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
      </div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
        <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
          {article.title}
        </h3>
        <p className="text-base sm:text-lg opacity-80 mb-6 line-clamp-3">
          {article.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm opacity-80">
            <Clock className="w-5 h-5 mr-2" />
            <span>{article.readTime || '5'} min read</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onSave?.(article)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              {article.isSaved ? (
                <BookmarkCheck className="w-6 h-6 text-yellow-400" />
              ) : (
                <Bookmark className="w-6 h-6 text-white" />
              )}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-lg font-medium transition bg-opacity-40"
            >
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
