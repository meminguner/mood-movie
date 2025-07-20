"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // 3 saniye sonra toast'ı kaldır
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validasyonu
    if (!name || !email || !password || !passwordConfirm) {
      showToast('Tüm alanları doldurun!', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showToast('Şifreler uyuşmuyor!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Şifre en az 6 karakter olmalıdır!', 'error');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Geçerli bir email adresi giriniz!', 'error');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        name,
        email,
        password,
        passwordConfirm
      });

      showToast(response.data.message, response.data.type);

      if (response.data.type === "success") {
        // Formu temizle
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        // Profil sayfasına yönlendir
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        // Backend'den gelen hata mesajı
        showToast(error.response.data.message || 'Bir hata oluştu', 'error');
      } else if (error.request) {
        // İstek yapıldı ama cevap alınamadı
        showToast('Sunucuya ulaşılamıyor', 'error');
      } else {
        // İstek oluşturulurken hata oluştu
        showToast('Bir hata oluştu', 'error');
      }
      console.error('Kayıt hatası:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast bildirimi */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white transition-all duration-500 ease-in-out`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yeni Hesap Oluştur
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ad Soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                Şifre Tekrar
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre Tekrar"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kayıt Ol
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 