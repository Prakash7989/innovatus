import React from 'react';
import { NewsCard } from '../components/NewsCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bookmark, Trash2 } from 'lucide-react';
import { auth } from '../lib/firebase';

export function SavedArticlesPage() {
  const [savedArticles, setSavedArticles] = useLocalStorage(`saved-articles-${auth.currentUser?.uid}`, []);

  const removeArticle = (articleId) => {
    setSavedArticles((prev) => prev.filter((article) => article.id !== articleId));
  };

  if (savedArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] 
        text-gray-500 dark:text-gray-400">
        <Bookmark className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-medium mb-2">No saved articles yet</h2>
        <p>Articles you save will appear here for offline reading</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Saved Articles
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your personal reading list for offline access
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {savedArticles.map((article) => (
          <div key={article.id} className="relative group">
            <NewsCard article={{ ...article, isSaved: true }} savedArticle={true} />
            <button
              onClick={() => removeArticle(article.id)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/90 text-white 
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}