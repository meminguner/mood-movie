Ana Dosya:
Entry point: backend/src/index.js
Express.js ile yazılmış, klasik sunucu mantığı var.
API Endpoint'leri:
/api/films (GET/POST): Filmleri getirir/ekler.
/api/film-robotu: Film öneri asistanı (OpenAI API ile).
/api/user: Kullanıcı işlemleri.
/register ve /login: Kayıt ve giriş işlemleri (API root'unda, /api altında değil).
Veritabanı ve Servisler:
MongoDB bağlantısı: Sadece process.env.MONGODB_URI ile çalışır.
Redis: Sadece process.env.REDIS_URL ile çalışır.
RabbitMQ: Sadece process.env.RABBITMQ_URL ile çalışır.
Bu environment variable'lar tanımlı değilse uygulama hata fırlatır ve başlatılmaz.
CORS:
Tüm origin'lere izin veriyor (geliştirme ve prod için uygun).
Vercel Deploy için:
Vercel'de custom Express.js sunucusu deploy etmek için vercel.json dosyası ile route yönlendirmesi yapılmalı.

Not: Vercel'de Express.js sunucusu "Serverless Function" olarak çalışır, app.listen kullanımı önerilmez.
(Vercel'de genellikle export edilen bir handler fonksiyonu gerekir.)
Önemli:
Eğer Vercel'de 404 alıyorsan, büyük ihtimalle route yönlendirmesi veya handler export'u eksik.
Vercel'de Express.js için genellikle şöyle olmalı:

Frontend'i İncelerken Aklında Tutman Gerekenler
API istekleri /api/films, /api/user, /api/film-robotu gibi endpoint'lere yapılmalı.
Eğer frontend'de environment variable ile backend adresi veriliyorsa (NEXT_PUBLIC_API_URL), bu adres backend'in Vercel'deki domaini olmalı.
Frontend'de authentication, film ekleme, film önerme gibi işlemler backend'deki ilgili endpoint'lere uygun şekilde yapılmalı.
Eğer frontend'de bir endpoint'e istek atıldığında 404 alınıyorsa, backend'de o endpoint'in doğru tanımlandığından ve Vercel'de doğru yönlendirildiğinden emin ol.
Özetle:
Backend Express.js, klasik sunucu mantığıyla yazılmış.
Vercel'de çalışması için özel route yönlendirmesi ve handler export'u gerekebilir.
Environment variable'lar zorunlu.
Frontend, backend'in API endpoint'lerine uygun şekilde istek atmalı.
Frontend'i inceledikten sonra, iki tarafı birleştirmek ve Vercel için doğru vercel.json dosyasını yazmak için hazırım!
Frontend'i incelememi istediğinde haber ver, hemen devam edelim.




Ran tool
### Frontend İncelemesi ve Notlar

#### 1. **API İstekleri ve Backend Adresi**
- API istekleri genellikle `frontend/src/app/utils/api.ts` ve ilgili componentlerde yapılıyor.
- **Şu an**:  
  - `API_BASE_URL = 'http://localhost:8080/api'` olarak hardcoded.
  - Diğer dosyalarda da (`/login`, `/register`, `/api/film-robotu` vs.) doğrudan `http://localhost:8080` kullanılmış.
- **Olması gereken**:  
  - Tüm API isteklerinde backend adresi environment variable'dan (`process.env.NEXT_PUBLIC_API_URL`) alınmalı.
  - Yani:  
    ```ts
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api';
    ```
  - Tüm fetch/axios isteklerinde bu kullanılmalı.

#### 2. **Kritik Endpointler**
- `/api/films` (GET/POST): Film listesi ve ekleme.
- `/api/film-robotu`: Film öneri asistanı.
- `/api/user`: Kullanıcı işlemleri.
- `/login` ve `/register`: Kayıt ve giriş (API root'unda, `/api` altında değil).

#### 3. **Kullanıcı Girişi ve Kayıt**
- `LoginForm.tsx` ve `RegisterForm.tsx` dosyalarında istekler doğrudan `http://localhost:8080/login` ve `http://localhost:8080/register` adreslerine atılıyor.
- Bunlar da environment variable ile dinamik olmalı.

#### 4. **Film Robotu ve Diğer Özellikler**
- Film robotu ve film arama gibi özellikler de local backend adresine bağlı.
- Bunlar da environment variable ile backend'e yönlendirilmeli.

#### 5. **Genel**
- Frontend Next.js ile yazılmış.
- API endpoint'leri backend'in Vercel'deki domainine yönlendirilirse, canlıda sorunsuz çalışır.
- `.env.local` dosyasında:
  ```
  NEXT_PUBLIC_API_URL=https://mood-movie-backend.vercel.app
  ```
  olmalı.

---

## **Frontend İçin Yapılması Gerekenler**

1. **Tüm API isteklerinde** backend adresini environment variable'dan alacak şekilde kodu güncelle.
   - `API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api'`
   - `/login`, `/register`, `/api/film-robotu` gibi endpoint'ler için de aynı şekilde.
2. **Local adresleri** (localhost) koddan tamamen kaldır.
3. **Vercel'de** frontend için `NEXT_PUBLIC_API_URL` environment variable'ı tanımlı olmalı.
4. **Frontend ve backend ayrı deploy edildiği için** CORS backend'de açık olmalı (zaten açık).
5. **Frontend'den yapılan tüm istekler** canlı backend'e yönlendirilecek şekilde olmalı.

---

## **Sonraki Adım: vercel.json**

- Backend Express.js sunucusu için Vercel'de özel route yönlendirmesi ve handler export'u gerekecek.
- Frontend için ekstra bir vercel.json gerekmez, Next.js zaten otomatik çalışır.
- Şimdi, hem backend hem frontend için bu bilgiler ışığında sana uygun bir `vercel.json` dosyası hazırlayabilirim.

---
