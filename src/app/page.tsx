'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

// Örnek film verileri
const films = [
  { 
    id: '3', 
    title: 'Recep İvedik', 
    image: '/images/recep-ivedik.jpg',
    year: '2008',
    director: 'Togan Gökbakar',
    description: 'Recep İvedik, Şahan Gökbakar\'ın başrolünü oynadığı Türk komedi filmidir.',
    rating: 5.0
  },
  { 
    id: '6', 
    title: 'Eşkıya', 
    image: '/images/eskıya.jpg',
    year: '1996',
    director: 'Yavuz Turgul',
    description: 'Türk sinemasının klasikleşmiş filmlerinden biri olan Eşkıya, bir eşkıyanın hikayesini anlatır.',
    rating: 4.9
  },
  { 
    id: '5', 
    title: 'Babam ve Oğlum', 
    image: '/images/babam-ve-oglum.jpg',
    year: '2005',
    director: 'Çağan Irmak',
    description: 'Baba-oğul ilişkisini konu alan duygusal bir Türk filmi.',
    rating: 4.8
  },
  { 
    id: '8', 
    title: 'Kış Uykusu', 
    image: '/images/kis-uykusu.jpg',
    year: '2014',
    director: 'Nuri Bilge Ceylan',
    description: 'Cannes Film Festivali\'nde Altın Palmiye ödülü kazanan film.',
    rating: 4.7
  },
  { 
    id: '4', 
    title: 'Kelebeğin Rüyası', 
    image: '/images/kelebegin-ruyasi.jpg',
    year: '2013',
    director: 'Yılmaz Erdoğan',
    description: 'Zonguldak\'ta yaşayan iki şairin hayatını konu alan dramatik bir film.',
    rating: 4.7
  },
  { 
    id: '7', 
    title: 'Ayla', 
    image: '/images/ayla.jpg',
    year: '2017',
    director: 'Can Ulkay',
    description: 'Kore Savaşı sırasında geçen gerçek bir hikayeyi anlatan film.',
    rating: 4.6
  },
  { 
    id: '1', 
    title: 'Adanalı', 
    image: '/images/adanalı.jpg',
    year: '2008',
    director: 'Murat Saraçoğlu',
    description: 'Adanalı, bir ailenin dramatik hikayesini anlatan bir filmdir.',
    rating: 4.5
  },
  { 
    id: '9', 
    title: 'Mustang', 
    image: '/images/mustang.jpg',
    year: '2015',
    director: 'Deniz Gamze Ergüven',
    description: 'Beş kız kardeşin özgürlük mücadelesini anlatan film.',
    rating: 4.4
  },
  { 
    id: '10', 
    title: 'Organize İşler', 
    image: '/images/organize-isler.jpg',
    year: '2005',
    director: 'Yılmaz Erdoğan',
    description: 'Bir dolandırıcılık hikayesini anlatan komedi filmi.',
    rating: 4.3
  },
  { 
    id: '2', 
    title: 'The Hacker', 
    image: '/images/the-hacker.jpg',
    year: '2016',
    director: 'Aydın Bulut',
    description: 'Siber dünyada geçen gerilim dolu bir film.',
    rating: 4.0
  }
];

export default function Home() {
  const router = useRouter();

  const handleFilmClick = (filmId: string) => {
    router.push(`/film/${filmId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Neyse Halin Çıksın Filmin
      </h1>

      {/* Film Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map((film) => (
          <div
            key={film.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleFilmClick(film.id)}
          >
            <h2 className="text-xl font-semibold mb-4">{film.title}</h2>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={film.image}
                alt={film.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Yönetmen: {film.director}</p>
              <p>Yıl: {film.year}</p>
              <p>Puan: {film.rating}/5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
