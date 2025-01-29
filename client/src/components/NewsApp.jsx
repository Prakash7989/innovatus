import React from 'react';
import { NewsCard } from './NewsCard';

const MOCK_NEWS = [
  {
    id: '1',
    title: 'The Future of AI in Document Management',
    description: 'Artificial Intelligence is revolutionizing how we handle and process documents...',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    date: new Date(),
    source: 'Tech Daily',
    url: '#'
  },
  {
    id: '2',
    title: 'New Breakthroughs in Natural Language Processing',
    description: 'Recent advances in NLP are making document analysis more accurate than ever...',
    category: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    date: new Date(),
    source: 'AI Weekly',
    url: '#'
  },
  {
    id: '3',
    title: 'The Rise of Cloud-Based Document Storage',
    description: 'Organizations are increasingly moving their document management systems to the cloud...',
    category: 'Cloud',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    date: new Date(),
    source: 'Cloud Tech',
    url: '#'
  }
];

export function NewsApp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Latest News</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Stay updated with the latest developments in document management and technology
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_NEWS.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}