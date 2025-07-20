import { getAllFilms, Film } from './api';

export async function findMatchingMovie(
  genre: string,
  duration: string,
  minRating: number
): Promise<string> {
  try {
    // Tüm filmleri API'den çek
    const films = await getAllFilms();
    
    if (films.length === 0) {
      throw new Error('Film bulunamadı');
    }

    // Süre aralıklarını belirleme
    const getDurationRange = (durationType: string): [number, number] => {
      switch (durationType) {
        case 'kısa': return [0, 100];
        case 'orta': return [100, 140];
        case 'uzun': return [140, Infinity];
        default: return [0, Infinity];
      }
    };

    const [minDuration, maxDuration] = getDurationRange(duration);

    // Kriterlere uyan filmleri filtreleme
    const matchingMovies = films.filter(film => {
      const durationMatch = film.duration >= minDuration && film.duration < maxDuration;
      const genreMatch = film.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()));
      const ratingMatch = film.averageRating >= minRating;

      return durationMatch && genreMatch && ratingMatch;
    });

    // Eşleşen film varsa rastgele birini seç, yoksa rastgele bir film seç
    if (matchingMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingMovies.length);
      return matchingMovies[randomIndex]._id;
    } else {
      const randomIndex = Math.floor(Math.random() * films.length);
      return films[randomIndex]._id;
    }
  } catch (error) {
    console.error('Film eşleştirme hatası:', error);
    // Hata durumunda boş string döndür
    return '';
  }
} 