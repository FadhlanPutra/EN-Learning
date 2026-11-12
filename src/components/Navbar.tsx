import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaTrophy, FaHistory, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { formatPrice } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useToast } from '../context/ToastContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { totalPoints, isLoading: progressLoading } = useProgress();
  const { showToast } = useToast();

  if (location.pathname === '/login') return null;

  const handleLogout = async () => {
    await logout();
    showToast('Berhasil keluar.', 'success');
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-700">
              <span className="text-2xl">🏪</span>
              <span>Quiz Shop</span>
            </Link>

            <div className="hidden md:flex md:items-center md:gap-4">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/shop"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/shop'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Shop
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/leaderboard'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/history"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/history'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaHistory className="w-5 h-5" />
                    History
                  </Link>
                  <Link
                    to="/account"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/account'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="w-5 h-5" />
                    Account
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {authLoading ? (
              <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" aria-hidden="true" />
            ) : isAuthenticated ? (
              <>
                {progressLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" aria-hidden="true" />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">
                      {formatPrice(totalPoints)}
                    </span>
                    <span className="text-xs text-gray-500">Points</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 transition-colors"
              >
                <FaSignInAlt className="w-5 h-5" />
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            {authLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" aria-hidden="true" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-700">
                  {formatPrice(totalPoints)}
                </span>
              </div>
            ) : null}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  location.pathname === '/'
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              {authLoading ? (
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" aria-hidden="true" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      location.pathname === '/shop'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Shop
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      location.pathname === '/leaderboard'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaTrophy className="w-5 h-5" />
                    Leaderboard
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      location.pathname === '/history'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaHistory className="w-5 h-5" />
                    History
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                      location.pathname === '/account'
                        ? 'bg-orange-50 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="w-5 h-5" />
                    Account
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-orange-700 hover:bg-orange-50"
                >
                  <FaSignInAlt className="w-5 h-5" />
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}