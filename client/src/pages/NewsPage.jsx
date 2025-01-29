import React, { useState, useEffect } from 'react';
import { NewsCard } from '../components/NewsCard';
import { VoiceControl } from '../components/VoiceControl';
import { Mic, TrendingUp, Filter } from 'lucide-react';
// import type { NewsArticle, NewsPreference } from '../types';

const MOCK_PREFERENCES = [
  { id: '1', topic: 'Technology', enabled: true },
  { id: '2', topic: 'Business', enabled: true },
  { id: '3', topic: 'Science', enabled: false },
  { id: '4', topic: 'Health', enabled: true },
];

const MOCK_TRENDING = [
  { id: '1', topic: 'AI Advancements', count: 1250 },
  { id: '2', topic: 'Climate Tech', count: 980 },
  { id: '3', topic: 'Digital Privacy', count: 850 },
];

export function NewsPage() {
  const [preferences, setPreferences] = useState(MOCK_PREFERENCES);
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [isVoiceActive, setVoiceActive] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchPersonalizedNews = () => {
      const enabledTopics = preferences.filter(p => p.enabled).map(p => p.topic);
      const mockNews = [
        {
          id: '1',
          title: 'AI Revolutionizes Document Analysis',
          description: 'New breakthroughs in AI are transforming how businesses handle document processing...',
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          date: new Date(),
          source: 'Tech Daily',
          url: '#',
          sentiment: 'positive'
        },
        {
          id: '2',
          title: 'Market Challenges in Tech Sector',
          description: 'Recent market volatility affects tech companies as investors reassess valuations...',
          category: 'Business',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
          date: new Date(),
          source: 'Financial Times',
          url: '#',
          sentiment: 'negative'
        },
        {
          id: '3',
          title: 'New Research in Quantum Computing',
          description: 'Scientists achieve breakthrough in quantum computing stability...',
          category: 'Science',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
          date: new Date(),
          source: 'Science Weekly',
          url: '#',
          sentiment: 'neutral'
        }
      ];
  
      const filteredNews = mockNews.filter(article =>
        enabledTopics.includes(article.category) &&
        (selectedSentiment === 'all' || article.sentiment === selectedSentiment)
      );
  
      // Ensure setArticles always gets an array
      setArticles(Array.isArray(filteredNews) ? filteredNews : []);
    };
  
    fetchPersonalizedNews();
  }, [preferences, selectedSentiment]);
  

  const togglePreference = (id) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    ));
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Personalized News Feed
            </h2>
            <button
              onClick={() => setVoiceActive(!isVoiceActive)}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                isVoiceActive
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/50 dark:bg-dark-100/50 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {isVoiceActive && <VoiceControl onClose={() => setVoiceActive(false)} />}

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
            {['all', 'positive', 'neutral', 'negative'].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => setSelectedSentiment(sentiment)}
                className={`px-3 sm:px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm transition-colors ${
                  selectedSentiment === sentiment
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/50 dark:bg-dark-100/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                {sentiment} tone
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {Array.isArray(articles) && articles.length > 0 ? (
  articles.map(article => (
    <NewsCard key={article.id} article={article} />
  ))
) : (
  <p className="text-gray-500 dark:text-gray-400">No articles available.</p>
)}

          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
          <div className="flex-1 lg:flex-none p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-500 dark:text-primary-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Preferences
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {preferences.map(pref => (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                    pref.enabled
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                      : 'bg-gray-50 dark:bg-dark-200/50 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {pref.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 lg:flex-none p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
            backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500 dark:text-primary-300" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Trending Topics
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {MOCK_TRENDING.map(topic => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 rounded-lg 
                    bg-gray-50 dark:bg-dark-200/50"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {topic.topic}
                  </span>
                  {/* <span className="text-sm text-primary-500 dark:text-primary-300">
                    {topic.count.toLocaleString()}
                  </span> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}