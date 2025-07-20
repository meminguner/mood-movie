'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

// Film verileri
const films = [
  { 
    id: '3', 
    title: 'Recep İvedik', 
    image: '/images/recep-ivedik.jpg',
    year: '2008',
    director: 'Togan Gökbakar',
    description: 'Recep İvedik, Şahan Gökbakar\'ın başrolünü oynadığı Türk komedi filmidir.',
    rating: 5.0,
    cast: ['Şahan Gökbakar', 'Fatma Toptaş', 'Tulug Çizgen'],
    duration: '102 dakika',
    genre: 'Komedi'
  },
  { 
    id: '6', 
    title: 'Eşkıya', 
    image: '/images/eskıya.jpg',
    year: '1996',
    director: 'Yavuz Turgul',
    description: 'Türk sinemasının klasikleşmiş filmlerinden biri olan Eşkıya, bir eşkıyanın hikayesini anlatır.',
    rating: 4.9,
    cast: ['Şener Şen', 'Uğur Yücel', 'Yeşim Salkım'],
    duration: '128 dakika',
    genre: 'Dram, Aksiyon'
  },
  { 
    id: '5', 
    title: 'Babam ve Oğlum', 
    image: '/images/babam-ve-oglum.jpg',
    year: '2005',
    director: 'Çağan Irmak',
    description: 'Baba-oğul ilişkisini konu alan duygusal bir Türk filmi. 12 Eylül döneminde yaşanan olayların bir aile üzerindeki etkisini anlatan dram.',
    rating: 4.8,
    cast: ['Çetin Tekindor', 'Fikret Kuşkan', 'Hümeyra'],
    duration: '112 dakika',
    genre: 'Dram'
  },
  { 
    id: '8', 
    title: 'Kış Uykusu', 
    image: '/images/kis-uykusu.jpg',
    year: '2014',
    director: 'Nuri Bilge Ceylan',
    description: 'Cannes Film Festivali\'nde Altın Palmiye ödülü kazanan film. Emekli bir tiyatro oyuncusunun Kapadokya\'daki otelinde yaşadığı olayları konu alır.',
    rating: 4.7,
    cast: ['Haluk Bilginer', 'Melisa Sözen', 'Demet Akbağ'],
    duration: '196 dakika',
    genre: 'Dram'
  },
  { 
    id: '4', 
    title: 'Kelebeğin Rüyası', 
    image: '/images/kelebegin-ruyasi.jpg',
    year: '2013',
    director: 'Yılmaz Erdoğan',
    description: 'Zonguldak\'ta yaşayan iki şairin hayatını konu alan dramatik bir film. 1940\'lı yıllarda geçen gerçek bir hikayeyi anlatıyor.',
    rating: 4.7,
    cast: ['Kıvanç Tatlıtuğ', 'Belçim Bilgin', 'Mert Fırat'],
    duration: '138 dakika',
    genre: 'Dram, Biyografi'
  },
  { 
    id: '7', 
    title: 'Ayla', 
    image: '/images/ayla.jpg',
    year: '2017',
    director: 'Can Ulkay',
    description: 'Kore Savaşı sırasında Türk askeri Süleyman Astsubay\'ın küçük bir Kore\'li kız çocuğuyla olan hikayesini anlatan film.',
    rating: 4.6,
    cast: ['İsmail Hacıoğlu', 'Çetin Tekindor', 'Kim Seol'],
    duration: '125 dakika',
    genre: 'Dram, Savaş'
  },
  { 
    id: '1', 
    title: 'Adanalı', 
    image: '/images/adanalı.jpg',
    year: '2008',
    director: 'Murat Saraçoğlu',
    description: 'Adanalı, bir ailenin dramatik hikayesini anlatan bir filmdir. Adana\'da geçen olaylar silsilesi, aile bağları ve geleneksel değerleri işler.',
    rating: 4.5,
    cast: ['Oktay Kaynarca', 'Mehmet Akif Alakurt', 'Selin Demiratar'],
    duration: '120 dakika',
    genre: 'Dram, Aile'
  },
  { 
    id: '9', 
    title: 'Mustang', 
    image: '/images/mustang.jpg',
    year: '2015',
    director: 'Deniz Gamze Ergüven',
    description: 'Beş kız kardeşin özgürlük mücadelesini anlatan film. Karadeniz\'de muhafazakar bir ortamda büyüyen kız kardeşlerin hikayesi.',
    rating: 4.4,
    cast: ['Güneş Şensoy', 'Doğa Doğuşlu', 'Elit İşcan'],
    duration: '97 dakika',
    genre: 'Dram'
  },
  { 
    id: '10', 
    title: 'Organize İşler', 
    image: '/images/organize-isler.jpg',
    year: '2005',
    director: 'Yılmaz Erdoğan',
    description: 'İstanbul\'da faaliyet gösteren bir dolandırıcılık çetesinin hikayesini anlatan komedi filmi.',
    rating: 4.3,
    cast: ['Yılmaz Erdoğan', 'Tolga Çevik', 'Özgü Namal'],
    duration: '116 dakika',
    genre: 'Komedi, Suç'
  },
  { 
    id: '2', 
    title: 'The Hacker', 
    image: '/images/the-hacker.jpg',
    year: '2016',
    director: 'Aydın Bulut',
    description: 'Siber dünyada geçen gerilim dolu bir film. Genç bir hackerin devlet kurumlarıyla olan mücadelesini anlatıyor.',
    rating: 4.0,
    cast: ['Burak Deniz', 'Melisa Şenolsun', 'Mert Yazıcıoğlu'],
    duration: '110 dakika',
    genre: 'Gerilim, Aksiyon'
  }
];

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

  // Yeni state'ler ekleyelim
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  const film = films.find(f => f.id === id);
  const isWatched = watchedMovies.includes(id as string);
  const isInWatchLaterList = isInWatchLater(id as string);

  // Kullanıcının daha önce verdiği puanı kontrol et
  useEffect(() => {
    if (isLoggedIn && film) {
      // Burada normalde API'den kullanıcının önceki puanını çekeceğiz
      // Şimdilik localStorage'dan alalım
      const storedRating = localStorage.getItem(`rating_${film.id}`);
      if (storedRating) {
        setUserRating(parseInt(storedRating));
      }
    }
  }, [isLoggedIn, film]);

  if (!film) {
    return <div className="text-center p-8">Film bulunamadı.</div>;
  }

  const handleRating = (rating: number) => {
    if (!isLoggedIn) {
      alert('Puan vermek için giriş yapmalısınız!');
      return;
    }

    const oldRating = userRating;
    setUserRating(rating);

    localStorage.setItem(`userRating_${film.id}`, rating.toString());

    const newTotal = totalRatings + (oldRating === 0 ? 1 : 0);
    const newAverage = ((averageRating * totalRatings) - oldRating + rating) / newTotal;
    setAverageRating(Number(newAverage.toFixed(1)));
    setTotalRatings(newTotal);
  };

  const handleResetRating = () => {
    if (!isLoggedIn) return;
    
    const oldRating = userRating;
    setUserRating(0);
    localStorage.removeItem(`userRating_${film.id}`);
    
    if (oldRating > 0) {
      const newTotal = totalRatings - 1;
      const newAverage = newTotal > 0 
        ? ((averageRating * totalRatings) - oldRating) / newTotal 
        : film.rating;
      setAverageRating(Number(newAverage.toFixed(1)));
      setTotalRatings(newTotal);
    }
  };

  // Yıldızları render eden bileşen
  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="text-2xl transition-colors duration-200 focus:outline-none"
          >
            <span className={`
              ${(hoveredRating || userRating) >= star 
                ? 'text-yellow-400' 
                : 'text-gray-300'
              } hover:text-yellow-500
            `}>
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {userRating > 0 ? `Sizin puanınız: ${userRating}` : 'Puan verin'}
        </span>
        {userRating > 0 && (
          <button
            onClick={handleResetRating}
            className="ml-3 p-1.5 bg-gray-100 hover:bg-red-100 rounded-full transition-all duration-200 group"
            title="Puanı sıfırla"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  const handleWatchClick = () => {
    if (isWatched) {
      removeFromWatched(id as string);
    } else {
      addToWatched(id as string);
    }
  };

  const handleWatchLaterClick = () => {
    if (isInWatchLaterList) {
      removeFromWatchLater(id as string);
    } else {
      addToWatchLater({
        id: film.id,
        title: film.title,
        image: film.image
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        username: 'Kullanıcı',
        text: newComment
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleEditComment = (commentId: number) => {
    if (editCommentText.trim()) {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: editCommentText }
          : comment
      ));
      setEditingCommentId(null);
      setEditCommentText('');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{film.title}</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Film Posteri */}
            <div className="w-full md:w-1/3">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="mt-4 space-y-4">
                {isLoggedIn && (
                  <>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}/5
                        </div>
                        <div className="text-sm text-gray-500">
                          {totalRatings} değerlendirme
                        </div>
                      </div>
                      {renderStars()}
                    </div>
                    <button 
                      onClick={handleWatchClick}
                      className={`w-full ${
                        isWatched 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white py-2 rounded-lg transition`}
                    >
                      {isWatched ? 'İzlediklerimden Kaldır' : 'İzledim'}
                    </button>
                    <button 
                      onClick={handleWatchLaterClick}
                      className={`w-full ${
                        isInWatchLaterList
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white py-2 rounded-lg transition`}
                    >
                      {isInWatchLaterList ? 'Listeden Kaldır' : 'Daha Sonra İzle'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Film Detayları */}
            <div className="flex-1">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Film hakkında</h2>
                <p className="text-gray-700 mb-4">{film.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Yönetmen:</strong> {film.director}</p>
                    <p><strong>Yıl:</strong> {film.year}</p>
                    <p><strong>Süre:</strong> {film.duration}</p>
                  </div>
                  <div>
                    <p><strong>Tür:</strong> {film.genre}</p>
                    <p><strong>Oyuncular:</strong> {film.cast?.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Yorumlar Bölümü */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>
                
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-blue-600">{comment.username}</p>
                          {editingCommentId === comment.id ? (
                            <div className="mt-2">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full p-2 border rounded-lg mb-2"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditComment(comment.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                                >
                                  Kaydet
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700">{comment.text}</p>
                          )}
                        </div>
                        {comment.username === 'Kullanıcı' && !editingCommentId && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingComment(comment)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    className="w-full p-3 border rounded-lg mb-2"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Yorum Yap
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Benzer Filmler Bölümü */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Benzer Filmler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {films
              .filter(f => f.id !== film.id && f.genre.split(', ').some(g => film.genre.includes(g)))
              .slice(0, 3)
              .map((similarFilm) => (
                <div
                  key={similarFilm.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => router.push(`/film/${similarFilm.id}`)}
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={similarFilm.image}
                      alt={similarFilm.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{similarFilm.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="text-lg">★</span>
                      <span className="text-gray-700">{similarFilm.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{similarFilm.genre}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 