'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFilmById, rateFilm, Film } from '../../utils/api';
import styles from './page.module.css';

interface Comment {
  id: number;
  username: string;
  text: string;
}

export default function FilmDetail() {
  const { id } = useParams();
  const { 
    isLoggedIn, 
    watchedMovies, 
    addToWatched, 
    removeFromWatched,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater
  } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, username: 'Ahmet', text: 'Fena değil' },
    { id: 2, username: 'Mehmet', text: 'Güzel' },
    { id: 3, username: 'Ayşe', text: 'Harika bir film!' },
    { id: 4, username: 'Ali', text: 'İzlemeye değer' },
  ]);
  const router = useRouter();

  // Film state'i
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rating state'leri
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const isWatched = film ? watchedMovies.includes(film._id) : false;
  const isInWatchLaterList = film ? isInWatchLater(film._id) : false;

  // Film verilerini yükle
  useEffect(() => {
    const fetchFilm = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const filmData = await getFilmById(id as string);
        if (filmData) {
          setFilm(filmData);
        } else {
          setError('Film bulunamadı');
        }
      } catch (err) {
        setError('Film yüklenirken bir hata oluştu');
        console.error('Film yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  // Kullanıcının daha önce verdiği puanı kontrol et
  useEffect(() => {
    if (isLoggedIn && film) {
      const storedRating = localStorage.getItem(`rating_${film._id}`);
      if (storedRating) {
        setUserRating(parseInt(storedRating));
      }
    }
  }, [isLoggedIn, film]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Film yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error || 'Film bulunamadı'}</p>
        </div>
      </div>
    );
  }

  const handleRating = async (rating: number) => {
    if (!isLoggedIn) {
      alert('Puan vermek için giriş yapmalısınız!');
      return;
    }

    try {
      const updatedFilm = await rateFilm(film._id, rating);
      if (updatedFilm) {
        setFilm(updatedFilm);
        setUserRating(rating);
        localStorage.setItem(`rating_${film._id}`, rating.toString());
      }
    } catch (error) {
      console.error('Film puanlanırken hata:', error);
      alert('Film puanlanırken bir hata oluştu');
    }
  };

  const handleResetRating = () => {
    if (!isLoggedIn) {
      alert('Puan sıfırlamak için giriş yapmalısınız!');
      return;
    }

    setUserRating(0);
    localStorage.removeItem(`rating_${film._id}`);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className={`text-2xl ${
            i <= (hoveredRating || userRating) ? 'text-yellow-500' : 'text-gray-300'
          } hover:text-yellow-500 transition-colors`}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  const handleWatchClick = () => {
    if (!isLoggedIn) {
      alert('İzleme listesine eklemek için giriş yapmalısınız!');
      return;
    }

    if (isWatched) {
      removeFromWatched(film._id);
    } else {
      addToWatched(film._id);
    }
  };

  const handleWatchLaterClick = () => {
    if (!isLoggedIn) {
      alert('İzleme listesine eklemek için giriş yapmalısınız!');
      return;
    }

    if (isInWatchLaterList) {
      removeFromWatchLater(film._id);
    } else {
      addToWatchLater({ id: film._id, title: film.title, image: film.image });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      username: 'Kullanıcı',
      text: newComment
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleEditComment = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, text: editCommentText }
        : comment
    ));
    setEditingCommentId(null);
    setEditCommentText('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Film Başlığı ve Geri Butonu */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ← Geri
            </button>
            <h1 className="text-3xl font-bold">{film.title}</h1>
            <div></div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Film Afişi */}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Modern Aksiyon Butonları - Poster Altı */}
              <div className={styles.actionButtonsModern} style={{ flexDirection: 'column', alignItems: 'stretch', marginTop: '1.5rem' }}>
                <button
                  onClick={handleWatchClick}
                  className={[
                    styles.actionCardBtn,
                    isWatched ? styles.watched : '',
                    isInWatchLaterList ? styles.disabled : ''
                  ].join(' ')}
                  disabled={isInWatchLaterList}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M7.629 15.71a1 1 0 0 1-1.415 0l-3.924-3.924a1 1 0 1 1 1.415-1.415l3.217 3.217 7.877-7.877a1 1 0 1 1 1.415 1.415l-8.585 8.584z"/></svg>
                  İzledim
                </button>
                <button
                  onClick={handleWatchLaterClick}
                  className={[
                    styles.actionCardBtn,
                    isInWatchLaterList ? styles.watchlater : '',
                    isWatched ? styles.disabled : ''
                  ].join(' ')}
                  disabled={isWatched}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 8.414V6a1 1 0 1 0-2 0v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414l-2.707-2.707z"/></svg>
                  Daha Sonra İzle
                </button>
              </div>
            </div>

            {/* Film Bilgileri */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Temel Bilgiler */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">{film.title}</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Yönetmen:</span> {film.director}
                    </div>
                    <div>
                      <span className="font-semibold">Yıl:</span> {film.year}
                    </div>
                    <div>
                      <span className="font-semibold">Süre:</span> {film.duration} dakika
                    </div>
                    <div>
                      <span className="font-semibold">Tür:</span> {film.genre.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Açıklama */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed">{film.description}</p>
                </div>

                {/* Oyuncular */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Oyuncular</h3>
                  <div className="flex flex-wrap gap-2">
                    {film.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Puanlama */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Puanlama</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {renderStars()}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Ortalama: {film.averageRating}/5</p>
                      <p>Toplam Puan: {film.totalRatings}</p>
                    </div>
                    {userRating > 0 && (
                      <button
                        onClick={handleResetRating}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Puanımı Sıfırla
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yorumlar Bölümü */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">Yorumlar</h3>
            
            {/* Yorum Ekleme Formu */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Gönder
                </button>
              </div>
            </form>

            {/* Yorumlar Listesi */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{comment.username}</p>
                      <p className="text-gray-700 mt-1">{comment.text}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingComment(comment)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  
                  {editingCommentId === comment.id && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-green-500 hover:text-green-700 text-sm"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 