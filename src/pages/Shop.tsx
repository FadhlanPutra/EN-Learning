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
  const { attempts, isLoading: progressLoading } = useProgress();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Gagal memuat barang. Silakan coba lagi.');
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
      <div className="min-h-screen py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shop</h1>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl animate-pulse p-3 flex items-center gap-3">
                <div className="h-11 w-11 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gagal Memuat Barang</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={loadItems} className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaShoppingBag className="text-orange-700 dark:text-orange-400" />
              Quiz Shop
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Pilih soal untuk dijawab. Setiap soal hanya bisa dijawab sekali.</p>
          </div>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
          >
            <FaTrophy className="w-5 h-5" />
            Peringkat
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama soal..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Semua Level</option>
                <option value="1">Mudah (&lt; 100 rb)</option>
                <option value="2">Sedang (100–300 rb)</option>
                <option value="3">Tantangan (300 rb+)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FaSort className="w-4 h-4 inline mr-1" />
                  Urutkan:
                </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="name">Nama: A ke Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tidak ada barang ditemukan</h2>
            <p className="text-gray-600 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                attempt={getAttemptForItem(item.id)}
                statusLoading={progressLoading}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FaInfoCircle className="w-5 h-5 text-orange-700 dark:text-orange-400" />
            Cara Kerja
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">Belum dijawab</span>
              <span>Belum pernah dijawab</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full text-xs font-medium">Benar</span>
              <span>Dijawab benar, poin didapat</span>
            </div>
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-medium">Salah</span>
              <span>Dijawab, poin 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}