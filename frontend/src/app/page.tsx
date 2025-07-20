'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAllFilms, Film } from "./utils/api";

export default function Home() {
  const router = useRouter();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        const filmsData = await getAllFilms();
        setFilms(filmsData);
      } catch (err) {
        setError('Filmler yüklenirken bir hata oluştu');
        console.error('Filmler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, []);

  const handleFilmClick = (filmId: string) => {
    router.push(`/film/${filmId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Neyse Halin Çıksın Filmin</h1>
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
          <h1 className="text-3xl font-bold mb-8">Neyse Halin Çıksın Filmin</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Neyse Halin Çıksın Filmin
      </h1>
      {/* Film Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map((film) => (
          <div
            key={film._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleFilmClick(film._id)}
          >
            <h2 className="text-xl font-semibold mb-4">{film.title}</h2>
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-200">
              {film.image ? (
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm">Resim Yok</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Yönetmen: {film.director}</p>
              <p>Yıl: {film.year}</p>
              <p>Puan: {film.averageRating}/5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
