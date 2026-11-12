import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useRequiredUser } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/format';
import { FaTrophy, FaHistory, FaSignOutAlt, FaArrowLeft, FaUser, FaEdit } from 'react-icons/fa';

export function Account() {
  const user = useRequiredUser();
  const { logout } = useAuth();
  const { totalPoints, accuracy, attempts, isLoading: progressLoading } = useProgress();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.username);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      showToast('Berhasil keluar.', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      showToast('Gagal keluar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || newName.trim() === user.username || newName.trim().length < 2 || newName.trim().length > 30) {
      return;
    }
    setLoading(true);
    try {
      const { enterName } = await import('../services/authService');
      await enterName(newName.trim());
      showToast('Nama kelompok diperbarui.', 'success');
      setEditingName(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal memperbarui nama.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const correctAnswers = attempts.filter(a => a.isCorrect).length;
  const totalAnswered = attempts.length;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Akun</h1>
              <p className="text-gray-600">Kelola profil dan pengaturan</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-700 to-amber-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength={30}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={loading}
                      className="px-3 py-2 bg-white hover:bg-orange-50 text-orange-700 rounded-lg transition-colors text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => { setEditingName(false); setNewName(user.username); }}
                      className="px-3 py-2 bg-white hover:bg-orange-50 text-orange-700 rounded-lg transition-colors text-sm"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="flex items-center gap-1 text-white/90 hover:text-white text-sm mt-1"
                    >
                      <FaEdit className="w-4 h-4" />
                      Ganti nama
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon={<FaTrophy className="w-6 h-6" />}
                value={formatPrice(totalPoints)}
                label="Total Poin"
                color="orange"
                loading={progressLoading}
              />
              <StatCard
                icon={<FaHistory className="w-6 h-6" />}
                value={`${accuracy}%`}
                label="Akurasi"
                color="green"
                loading={progressLoading}
              />
              <StatCard
                icon={<FaHistory className="w-6 h-6" />}
                value={totalAnswered}
                label="Soal Dijawab"
                color="blue"
                loading={progressLoading}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Benar: {correctAnswers} dari {totalAnswered} soal
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FaUser className="text-orange-700" />
              Pengaturan
            </h2>
          </div>

          <div className="p-6">
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Zona Bahaya</h3>
              <p className="text-sm text-gray-600 mb-4">
                Keluar akan mengakhiri sesi di perangkat ini. Poin kelompok tetap tersimpan dan bisa diakses lagi dengan memasukkan nama yang sama.
              </p>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-3 px-4 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
              >
                <FaSignOutAlt className="w-5 h-5" />
                {loading ? 'Keluar...' : 'Keluar / Ganti Kelompok'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/history"
            className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
          >
            <FaHistory className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Riwayat</h3>
            <p className="text-sm text-gray-600 mt-1">Lihat semua soal yang dijawab</p>
          </Link>

          <Link
            to="/leaderboard"
            className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
          >
            <FaTrophy className="w-10 h-10 text-amber-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Peringkat</h3>
            <p className="text-sm text-gray-600 mt-1">Cek posisi kelompok Anda</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, loading }: { icon: React.ReactNode; value: string | number; label: string; color: string; loading?: boolean }) {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-xl text-center ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="mx-auto mb-2">{icon}</div>
      {loading ? (
        <div className="h-7 w-16 mx-auto bg-gray-200 rounded animate-pulse" aria-hidden="true" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}