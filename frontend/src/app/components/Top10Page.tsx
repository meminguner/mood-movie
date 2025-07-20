'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getTop10Films, Film } from '../utils/api';

export default function Top10Page() {
  const router = useRouter();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop10Films = async () => {
      try {
        setLoading(true);
        const filmsData = await getTop10Films();
        setFilms(filmsData);
      } catch (err) {
        setError('Filmler yüklenirken bir hata oluştu');
        console.error('Top 10 filmler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTop10Films();
  }, []);

  const handleFilmClick = (filmId: string) => {
    router.push(`/film/${filmId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">En İyi 10 Film</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Filmler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">En İyi 10 Film</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        En İyi 10 Film
      </h1>

      <div className="space-y-6">
        {films.map((film, index) => (
          <div
            key={film._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleFilmClick(film._id)}
          >
            <div className="flex flex-col md:flex-row">
              {/* Sıra Numarası */}
              <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center text-2xl font-bold">
                {index + 1}
              </div>

              {/* Film Afişi */}
              <div className="w-full md:w-48 h-64 relative">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Film Bilgileri */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{film.title}</h2>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-xl mr-1">★</span>
                    <span className="text-lg font-semibold">{film.averageRating}</span>
                  </div>
                </div>

                <div className="text-gray-600 mb-4">
                  <p className="font-semibold">{film.director}</p>
                  <p>{film.year}</p>
                </div>

                <p className="text-gray-700">{film.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 