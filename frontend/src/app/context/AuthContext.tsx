"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface WatchLaterMovie {
  id: string;
  title: string;
  image: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: {
      joinDate: string;
      name: string;
      watchLater: ({ id: number; title: string } | { id: number; title: string })[];
      watchedMovies: ({ id: number; title: string } | { id: number; title: string })[];
      email: string
  }) => void;
  logout: () => void;
  updateUserInfo: (userData: { name: string; email: string }) => void;
  watchedMovies: string[];
  addToWatched: (movieId: string) => void;
  removeFromWatched: (movieId: string) => void;
  watchLaterMovies: WatchLaterMovie[];
  addToWatchLater: (movie: WatchLaterMovie) => void;
  removeFromWatchLater: (movieId: string) => void;
  isInWatchLater: (movieId: string) => boolean;
  userInfo?: {
    name?: string;
    email?: string;
    joinDate?: string;
  };
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUserInfo: () => {},
  watchedMovies: [],
  addToWatched: () => {},
  removeFromWatched: () => {},
  watchLaterMovies: [],
  addToWatchLater: () => {},
  removeFromWatchLater: () => {},
  isInWatchLater: () => false,
});

// localStorage'dan veri okuma fonksiyonu
const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { 
      isLoggedIn: false, 
      userInfo: undefined,
      watchedMovies: [],
      watchLaterMovies: []
    };
  }
  
  const storedLogin = localStorage.getItem('isLoggedIn');
  const storedUser = localStorage.getItem('userInfo');
  const storedWatchedMovies = localStorage.getItem('watchedMovies');
  const storedWatchLaterMovies = localStorage.getItem('watchLaterMovies');
  
  return {
    isLoggedIn: storedLogin === 'true',
    userInfo: storedUser ? JSON.parse(storedUser) : undefined,
    watchedMovies: storedWatchedMovies ? JSON.parse(storedWatchedMovies) : [],
    watchLaterMovies: storedWatchLaterMovies ? JSON.parse(storedWatchLaterMovies) : []
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Başlangıç state'ini localStorage'dan al
  const initialState = getInitialAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialState.isLoggedIn);
  const [userInfo, setUserInfo] = useState<any>(initialState.userInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchedMovies, setWatchedMovies] = useState<string[]>(initialState.watchedMovies);
  const [watchLaterMovies, setWatchLaterMovies] = useState<WatchLaterMovie[]>(initialState.watchLaterMovies);

  // Component mount olduktan sonra loading state'ini false yap
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // localStorage ile state'i senkronize et
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
      if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } else {
        localStorage.removeItem('userInfo');
      }
    }
  }, [isLoggedIn, userInfo]);

  // watchedMovies ve watchLaterMovies'i localStorage'da sakla
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
    }
  }, [watchedMovies]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
    }
  }, [watchLaterMovies]);

  const login = (userData: any) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userInfo', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(undefined);
    setWatchedMovies([]);
    setWatchLaterMovies([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('watchedMovies');
      localStorage.removeItem('watchLaterMovies');
    }
  };

  const updateUserInfo = (userData: { name: string; email: string }) => {
    const updatedUserInfo = {
      ...userInfo,
      ...userData
    };
    setUserInfo(updatedUserInfo);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  };

  const addToWatched = (movieId: string) => {
    setWatchedMovies(prev => [...prev, movieId]);
  };

  const removeFromWatched = (movieId: string) => {
    setWatchedMovies(prev => prev.filter(id => id !== movieId));
  };

  const addToWatchLater = (movie: WatchLaterMovie) => {
    setWatchLaterMovies(prev => [...prev, movie]);
  };

  const removeFromWatchLater = (movieId: string) => {
    setWatchLaterMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isInWatchLater = (movieId: string) => {
    return watchLaterMovies.some(movie => movie.id === movieId);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isLoading,
      login, 
      logout,
      updateUserInfo,
      watchedMovies,
      addToWatched,
      removeFromWatched,
      watchLaterMovies,
      addToWatchLater,
      removeFromWatchLater,
      isInWatchLater,
      userInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 