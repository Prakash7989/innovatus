import React, { useState, useEffect } from "react";
import { NewsCard } from "../components/NewsCard";
import {  TrendingUp, Filter, ChevronDown } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useLocalStorage } from "../hooks/useLocalStorage";


const DropdownPanel = ({ isOpen, onToggle, icon: Icon, title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-500 dark:text-primary-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {/* Desktop view - always visible */}
      <div className="hidden lg:block p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-primary-500 dark:text-primary-300" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {children}
      </div>
      {/* Mobile view - toggleable */}
      {isOpen && <div className="p-4 pt-0 lg:hidden">{children}</div>}
    </div>
  );
};

export function NewsPage({ theme }) {
  // ... (keep all the state declarations and handlers the same)

  const [isVoiceActive, setVoiceActive] = useState(false);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryScores, setCategoryScores] = useState({});
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [savedArticles, setSavedArticles] = useLocalStorage(
    `saved-articles-${auth.currentUser?.uid}`,
    []
  );
  
  const [isTrendingOpen, setTrendingOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Handle saving articles
  const handleSaveArticle = async (article) => {
    setSavedArticles((prev) => {
      const isAlreadySaved = prev.some((saved) => saved.id === article.id);
      if (isAlreadySaved) {
        return prev.filter((saved) => saved.id !== article.id);
      } else {
        return [...prev, article];
      }
    });

    if (auth.currentUser && article.category) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const currentScores = userDoc.exists() ? userDoc.data().categoryScores || {} : {};
      
      const updatedScores = { ...currentScores };
      article.category.forEach((category) => {
        updatedScores[category] = (updatedScores[category] || 0) + 1;
      });

      await setDoc(userRef, { categoryScores: updatedScores }, { merge: true });
      setCategoryScores(updatedScores);
    }
  };

  // Keep the fetchNews useEffect and other functions the same...
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

  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter((article) => article.category?.includes(selectedCategory));

  return (
    <div className="w-full min-h-screen  dark:bg-gray-900 ">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-72 flex flex-col gap-4 order-1 lg:order-2">
            <div className="sticky top-24 space-y-4">
              {/* Trending Categories */}
              <DropdownPanel
                isOpen={isTrendingOpen}
                onToggle={() => setTrendingOpen(!isTrendingOpen)}
                icon={TrendingUp}
                title="Trending in last 24 hours"
              >
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
                  <p className="text-gray-600 dark:text-gray-400">
                    No trending topics yet.
                  </p>
                )}
              </DropdownPanel>

              {/* Filter Categories */}
              <DropdownPanel
                isOpen={isFilterOpen}
                onToggle={() => setFilterOpen(!isFilterOpen)}
                icon={Filter}
                title="Filter by Category"
              >
                <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          if (window.innerWidth < 1024) {
                            setFilterOpen(false);
                          }
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedCategory === category
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                            : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownPanel>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="primary text-2xl font-semibold text-primary-600 dark:text-white">
                Latest News
              </h2>
              <button
                onClick={() => setVoiceActive(!isVoiceActive)}
                className={`p-2 rounded-full transition-colors ${
                  isVoiceActive
                    ? "bg-primary-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
              </button>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={{
                      ...article,
                      isSaved: savedArticles.some(
                        (saved) => saved.id === article.id
                      ),
                    }}
                    onSave={handleSaveArticle}
                    categoryScores={categoryScores}
                    theme={theme}
                  />
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
                  No news available for this category.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}