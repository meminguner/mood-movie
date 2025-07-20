'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRandomFilm } from '../utils/api';

export default function LuckyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomFilm = async () => {
      try {
        setLoading(true);
        const randomFilm = await getRandomFilm();
        if (randomFilm) {
          router.push(`/film/${randomFilm._id}`);
        } else {
          setError('Rastgele film bulunamadı');
          setLoading(false);
        }
      } catch (err) {
        setError('Film yüklenirken bir hata oluştu');
        setLoading(false);
        console.error('Rastgele film yüklenirken hata:', err);
      }
    };

    fetchRandomFilm();
  }, [router]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Şanslı Film</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Şanslı Filmin Seçiliyor...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Film seçiliyor, lütfen bekleyin...</p>
      </div>
    </div>
  );
} 