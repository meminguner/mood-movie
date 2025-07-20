import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api';

export interface Film {
  _id: string;
  title: string;
  description: string;
  director: string;
  year: number;
  duration: number;
  genre: string[];
  cast: string[];
  image: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

// Tüm filmleri getir
export const getAllFilms = async (): Promise<Film[]> => {
  console.log("getAllFilms çalıştı")
  try {
    const response = await fetch(`${API_BASE_URL}/films`);
    if (!response.ok) {
      throw new Error('Filmler getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Filmler getirilirken hata:', error);
    return [];
  }
};

// Tek film getir
export const getFilmById = async (id: string): Promise<Film | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films/${id}`);
    if (!response.ok) {
      throw new Error('Film getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Film getirilirken hata:', error);
    return null;
  }
};

// Rastgele film getir
export const getRandomFilm = async (): Promise<Film | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films/random/film`);
    if (!response.ok) {
      throw new Error('Rastgele film getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Rastgele film getirilirken hata:', error);
    return null;
  }
};

// Top 10 film getir
export const getTop10Films = async (): Promise<Film[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films/top10/films`);
    if (!response.ok) {
      throw new Error('Top 10 filmler getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Top 10 filmler getirilirken hata:', error);
    return [];
  }
};

// Film puanla
export const rateFilm = async (filmId: string, rating: number): Promise<Film | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });
    if (!response.ok) {
      throw new Error('Film puanlanamadı');
    }
    return await response.json();
  } catch (error) {
    console.error('Film puanlanırken hata:', error);
    return null;
  }
};

// Film arama
export const searchFilms = async (query: string): Promise<Film[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Arama başarısız');
    }
    return await response.json();
  } catch (error) {
    console.error('Film arama hatası:', error);
    return [];
  }
}; 