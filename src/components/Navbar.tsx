import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaTrophy, FaHistory, FaUsers, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { formatPrice } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { totalPoints } = useProgress();

  const navLinks = [
    { path: '/', label: 'Home', icon: () => <FaUsers className="w-5 h-5" /> },
    { path: '/shop', label: 'Shop', icon: () => <FaTrophy className="w-5 h-5" /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: () => <FaTrophy className="w-5 h-5" /> },
  ];

  const authLinks = isAuthenticated
    ? [
        { path: '/history', label: 'History', icon: () => <FaHistory className="w-5 h-5" /> },
        { path: '/account', label: 'Account', icon: () => <FaUser className="w-5 h-5" /> },
      ]
    : [
        { path: '/login', label: 'Login', icon: () => <FaSignOutAlt className="w-5 h-5" /> },
      ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-600 dark:text-orange-400">
            <span className="text-2xl">🏪</span>
            <span>Quiz Shop</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {link.icon()}
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 px-3 py-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {formatPrice(totalPoints)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Points</span>
              </div>
            )}

            {authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {link.icon()}
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {formatPrice(totalPoints)}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.icon()}
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="px-3 py-2.5 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center gap-3">
                    <FaTrophy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-base font-medium text-orange-600 dark:text-orange-400">
                      {formatPrice(totalPoints)} Points
                    </span>
                  </div>
                  {authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                        location.pathname === link.path
                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {link.icon()}
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
              
              {!isAuthenticated && authLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.icon()}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}