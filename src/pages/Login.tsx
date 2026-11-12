import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FaUsers, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function isValidInternalPath(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.startsWith('/login')) return false;
  return true;
}

export function Login() {
  const { enterName, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nextParam = searchParams.get('next') || '/shop';
  const from = isValidInternalPath(nextParam) ? nextParam : '/shop';

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Nama kelompok tidak boleh kosong.');
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 30) {
      setError('Nama kelompok harus 2-30 karakter.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await enterName(trimmedName);
      showToast(`Selamat datang, ${trimmedName}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-700">
              <span className="text-2xl">🏪</span>
              <span>Quiz Shop</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Kembali ke Home
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Masuk / Daftar</h1>
              <p className="text-gray-600 mt-2">
                Ketik nama kelompok untuk mulai bermain
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Group Name */}
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Kelompok
                </label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                  <input
                    id="group-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Kelompok A"
                    autoComplete="off"
                    disabled={loading}
                    maxLength={30}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'name-error' : undefined}
                  />
                </div>
                {error && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-orange-700 hover:bg-orange-800 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <FaArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Nama kelompok boleh kembar. Poin tersimpan per perangkat.</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Quiz Shop - English Learning Game for Classrooms</p>
          </div>
        </div>
      </div>
    </div>
  );
}