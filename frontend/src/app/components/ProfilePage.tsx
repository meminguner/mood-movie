"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserInfo = {
  name?: string;
  email?: string;
  joinDate?: string;
  watchedMovies?: any[]; // veya eğer film objesi ise: MovieType[]
};

const ProfilePage = () => {
  const { isLoggedIn, isLoading, userInfo, logout, updateUserInfo } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editedInfo, setEditedInfo] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
    if (userInfo) {
      setEditedInfo({
        name: userInfo.name || '',
        email: userInfo.email || '',
      });
    }
  }, [isLoggedIn, isLoading, router, userInfo]);

  // Loading durumunda loading mesajı göster
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Değişiklikleri AuthContext üzerinden uygula
    updateUserInfo({
      name: editedInfo.name,
      email: editedInfo.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
    });
    setIsEditing(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    showToast('Hesap başarıyla silindi', 'success');
    setShowDeleteConfirm(false);
    
    // Kısa bir gecikme ile çıkış yap ve ana sayfaya yönlendir
    setTimeout(() => {
      logout();
      router.push('/');
    }, 2000);
  };

  // İzlenen Filmler
  const renderWatchedMovies = () => {
    if (!userInfo?.watchedMovies?.length) {
      return <p className="text-gray-500">Henüz film izlememişsiniz.</p>;
    }

    return userInfo.watchedMovies.map((movie) => (
      <div
        key={movie.id}
        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
      >
        <div>
          <h3 className="font-semibold">{movie.title}</h3>
        </div>
      </div>
    ));
  };

  // Daha Sonra İzlenecekler
  const renderWatchLater = () => {
    if (!userInfo?.watchLater?.length) {
      return <p className="text-gray-500">Listenizde film bulunmuyor.</p>;
    }

    return userInfo.watchLater.map((movie) => (
      <div
        key={movie.id}
        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
      >
        <div>
          <h3 className="font-semibold">{movie.title}</h3>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profil Kartı */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İsim
                </label>
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Kaydet
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{userInfo?.name || 'İsimsiz Kullanıcı'}</h2>
                <p className="text-gray-600">{userInfo?.email || 'Email yok'}</p>
                <p className="text-sm text-gray-500">
                  Üyelik: {userInfo?.joinDate || 'Bilinmiyor'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Düzenle
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Çıkış Yap
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          )}
        </div>

        {/* İzlenen Filmler */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">İzlenen Filmler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderWatchedMovies()}
          </div>
        </div>

        {/* Daha Sonra İzlenecekler */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Daha Sonra İzlenecekler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderWatchLater()}
          </div>
        </div>
      </div>

      {/* Hesap Silme Onay Modalı */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Hesabı Sil</h3>
            <p className="mb-4">Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Hesabı Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Bildirimi */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 