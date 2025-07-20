'use client';

import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getFilmById, Film } from '../utils/api';

export default function Profile() {
  const { isLoggedIn, isLoading, userInfo, watchedMovies, watchLaterMovies, logout } = useAuth();
  const router = useRouter();
  const [watchedFilmDetails, setWatchedFilmDetails] = useState<Film[]>([]);
  const [loadingWatchedFilms, setLoadingWatchedFilms] = useState(false);

  // İzlenen filmlerin detaylarını yükle
  useEffect(() => {
    const loadWatchedFilmDetails = async () => {
      if (watchedMovies.length === 0) {
        setWatchedFilmDetails([]);
        return;
      }

      setLoadingWatchedFilms(true);
      try {
        const filmPromises = watchedMovies.map(async (movieId) => {
          try {
            const film = await getFilmById(movieId);
            return film;
          } catch (error) {
            console.error(`Film ${movieId} yüklenirken hata:`, error);
            return null;
          }
        });

        const films = await Promise.all(filmPromises);
        const validFilms = films.filter(film => film !== null) as Film[];
        setWatchedFilmDetails(validFilms);
      } catch (error) {
        console.error('İzlenen filmler yüklenirken hata:', error);
      } finally {
        setLoadingWatchedFilms(false);
      }
    };

    loadWatchedFilmDetails();
  }, [watchedMovies]);

  // Loading durumunda loading mesajı göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapılmadı</h1>
          <p>Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-300 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profil Kartı */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">
                  {userInfo?.name?.[0]?.toUpperCase() || 'D'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userInfo?.name || 'deneme'}</h2>
                <p className="text-gray-600">{userInfo?.email || 'deneme@gmail.com'}</p>
                <p className="text-sm text-gray-500">Üyelik: {userInfo?.joinDate || '2025'}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Düzenle
                </button>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Çıkış Yap
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>

          {/* İzlenen Filmler */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">İzlenen Filmler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadingWatchedFilms ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Filmler yükleniyor...</span>
                </div>
              ) : watchedFilmDetails.length === 0 ? (
                <p className="text-gray-500 col-span-2">Henüz film izlememişsiniz.</p>
              ) : (
                watchedFilmDetails.map((film) => (
                  <div 
                    key={film._id}
                    className="flex bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => router.push(`/film/${film._id}`)}
                  >
                    <div className="w-24 h-36 relative flex-shrink-0">
                      <Image
                        src={film.image}
                        alt={film.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-bold text-lg mb-1">{film.title}</h3>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <span className="text-lg">★</span>
                        <span className="text-gray-700">{film.averageRating}/5</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/film/${film._id}`);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Detayları Gör →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daha Sonra İzlenecekler */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Daha Sonra İzlenecekler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchLaterMovies.length === 0 ? (
                <p className="text-gray-500 col-span-2">Listenizde film bulunmuyor.</p>
              ) : (
                watchLaterMovies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="flex bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => router.push(`/film/${movie.id}`)}
                  >
                    <div className="w-24 h-36 relative flex-shrink-0">
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <span className="text-lg">★</span>
                        <span className="text-gray-700">?/5</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/film/${movie.id}`);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Detayları Gör →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 