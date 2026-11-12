import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { getItems } from '../services/itemService';
import { getLevel } from '../utils/level';
import { ItemCard } from '../components';
import { useProgress } from '../context/ProgressContext';
import { FaFilter, FaSort, FaSearch, FaShoppingBag, FaTrophy, FaInfoCircle } from 'react-icons/fa';

type LevelFilter = 'all' | '1' | '2' | '3';

export function Shop() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');
  const { attempts } = useProgress();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const itemLevel = getLevel(item.price);
        const matchesLevel = selectedLevel === 'all' || String(itemLevel) === selectedLevel;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [items, searchQuery, selectedLevel, sortBy]);

  const getAttemptForItem = (itemId: string) => attempts.find((a) => a.itemId === itemId);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shop</h1>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Items</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={loadItems} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaShoppingBag className="text-orange-600 dark:text-orange-400" />
              Quiz Shop
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Choose questions to answer. Each item can only be answered once.</p>
          </div>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
          >
            <FaTrophy className="w-5 h-5" />
            Leaderboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Search items"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="level-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaFilter className="w-4 h-4 inline mr-1" />
                Level:
              </label>
              <select
                id="level-filter"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as LevelFilter)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Levels</option>
                <option value="1">Easy (under 100K)</option>
                <option value="2">Medium (100K - 300K)</option>
                <option value="3">Challenge (300K+)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <FaSort className="w-4 h-4 inline mr-1" />
                Sort:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name')}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h2>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                attempt={getAttemptForItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FaInfoCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            How it works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Not Attempted</span>
              <span>You haven't answered this question yet</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-medium">Correct</span>
              <span>You answered correctly and earned points</span>
            </div>
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-medium">Incorrect</span>
              <span>You answered but got 0 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}