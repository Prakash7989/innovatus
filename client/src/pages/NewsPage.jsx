import React, { useState, useEffect } from "react";
import { NewsCard } from "../components/NewsCard";
import { VoiceControl } from "../components/VoiceControl.jsx";
import { Mic, TrendingUp, Filter } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useLocalStorage } from "../hooks/useLocalStorage";


export function NewsPage({ theme }) {
  const [isVoiceActive, setVoiceActive] = useState(false);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryScores, setCategoryScores] = useState({});
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [savedArticles, setSavedArticles] = useLocalStorage(`saved-articles-${auth.currentUser?.uid}`, []);

  const handleSaveArticle = (article) => {
    setSavedArticles((prev) => {
      const isAlreadySaved = prev.some((saved) => saved.id === article.id);
      if (isAlreadySaved) {
        return prev.filter((saved) => saved.id !== article.id);
      } else {
        return [...prev, article];
      }
    });
  };

  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const newsData = await response.json();

        const user = auth.currentUser;
        if (!user) return setArticles(newsData);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        let scores = {};
        if (userDoc.exists()) {
          scores = userDoc.data().categoryScores || {};
        }

        // Count occurrences of categories
        let categoryCounts = {};
        newsData.forEach((article) => {
          if (article.category) {
            article.category.forEach((cat) => {
              categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });
          }
        });

        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setTrendingCategories(sortedCategories);

        const allCategories = new Set(Object.keys(categoryCounts));
        setCategories(["all", ...Array.from(allCategories)]);

        newsData.sort((a, b) => {
          const aScore = Math.max(
            ...(a.category?.map((c) => scores[c] || 0) || [0])
          );
          const bScore = Math.max(
            ...(b.category?.map((c) => scores[c] || 0) || [0])
          );
          return bScore - aScore;
        });

        setArticles(newsData);
        setCategoryScores(scores);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) =>
          article.category?.includes(selectedCategory)
        );

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

          {isVoiceActive && (
            <VoiceControl onClose={() => setVoiceActive(false)} />
          )}

          {/* Category Filters */}
          {/* <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-500 text-white"
                    : "bg-white/50 dark:bg-dark-100/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div> */}

          {/* News Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mt-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={{
                    ...article,
                    isSaved: savedArticles.some((saved) => saved.id === article.id),
                  }}
                  onSave={handleSaveArticle}
                  categoryScores={categoryScores}
                  theme={theme}
                />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center w-full">
                No news available for this category.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 lg:sticky lg:top-4 lg:max-h-[calc(80vh-2rem)] lg-top-0 lg-fixed lg-sticky ">
          <div
            className="flex-1 lg:flex-none p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-500 dark:text-primary-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filter by Category
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                      : "bg-gray-50 dark:bg-dark-200/50 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex-1 lg:flex-none p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
  backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500 dark:text-primary-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Trending in last 24 hours
              </h3>
            </div>
            {trendingCategories.length > 0 ? (
              <ul className="text-gray-700 dark:text-gray-300">
                {trendingCategories.map(([category, count]) => (
                  <li key={category} className="flex justify-between py-1">
                    <span className="capitalize">{category}</span>
                    <span className="font-semibold text-blue-500">{count}+ </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No trending topics yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
