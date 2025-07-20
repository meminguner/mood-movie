"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { searchFilms, Film } from '../utils/api';

const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Arama inputu değişince arama yap
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!search) {
      setSearchResults([]);
      setSearching(false);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    setShowDropdown(true);
    const timer = setTimeout(async () => {
      const results = await searchFilms(search);
      setSearchResults(results);
      setSearching(false);
      setShowDropdown(true);
    }, 400);
    setDebounceTimer(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Dışarı tıklanınca dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilmClick = (filmId: string) => {
    setShowDropdown(false);
    setSearch("");
    router.push(`/film/${filmId}`);
  };

  // Eşleşen harfleri bold yapan yardımcı fonksiyon
  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <b key={i} className="text-blue-700">{part}</b> : part
    );
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center">
            <div className="bg-white p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </Link>
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100">
            Neyse Halin Çıksın filmin
          </Link>
        </div>
        
        <div className="flex-1 mx-4 relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Film Ara..."
              className="w-full p-2 pl-4 pr-10 rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => search && setShowDropdown(true)}
            />
            <div className="absolute right-3 top-2.5">
              🔍
            </div>
            {/* Sonuçlar Dropdown */}
            {showDropdown && search && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 bg-white border border-blue-200 rounded-b-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto"
              >
                {searching ? (
                  <div className="p-4 text-center text-gray-500">Aranıyor...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">Sonuç bulunamadı</div>
                ) : (
                  searchResults.map(film => (
                    <div
                      key={film._id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex items-center"
                      onClick={() => handleFilmClick(film._id)}
                    >
                      <span className="text-base">{highlightMatch(film.title, search)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 text-white">
          <Link href="/top10" className="hover:text-blue-100">
            İlk 10
          </Link>
          <span className="text-blue-200">|</span>
          <Link href="/lucky" className="hover:text-blue-100">
            Şanslı Film
          </Link>
          <span className="text-blue-200">|</span>
          <Link 
            href="/film-robotu" 
            className="bg-yellow-400 text-blue-600 px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-semibold flex items-center gap-2"
          >
            Film Robotu 🎬
          </Link>
          {!isLoading && (
            isLoggedIn ? (
              <Link href="/profile" className="ml-6">
                <div className="bg-white p-2 rounded-full hover:bg-blue-50 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </Link>
            ) : (
              <Link href="/login" className="ml-6 hover:text-blue-100 font-semibold">
                Giriş Yap
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 