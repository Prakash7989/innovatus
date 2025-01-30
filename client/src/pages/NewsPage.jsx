import React, { useState, useEffect } from "react";
import { NewsCard } from "../components/NewsCard";
import { VoiceControl } from "../components/VoiceControl.jsx";
import { Mic, TrendingUp } from "lucide-react";

export function NewsPage() {
  const [isVoiceActive, setVoiceActive] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-news");
        if (!response.ok) throw new Error("Failed to fetch news");

        const newsData = await response.json();
        setArticles(newsData); // Directly set articles without filtering
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Latest News
            </h2>
            <button
              onClick={() => setVoiceActive(!isVoiceActive)}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                isVoiceActive
                  ? "bg-primary-500 text-white"
                  : "bg-white/50 dark:bg-dark-100/50 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {isVoiceActive && <VoiceControl onClose={() => setVoiceActive(false)} />}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mt-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center w-full">
                No news available.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
          <div
            className="flex-1 lg:flex-none p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500 dark:text-primary-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Trending Topics
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Check out the latest trending news articles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
