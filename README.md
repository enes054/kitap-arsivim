# 📚 Kitap Arşivim - Kişisel Kitap Yönetim Platformu

Modern, kullanıcı dostu bir kitap yönetim uygulaması. Okuduğunuz kitapları takip edin, notlar alın, kategorilere ayırın ve okuma listenizi yönetin.

## 🌟 Özellikler

### 📖 Kitap Yönetimi
- **Okuduklarım**: Bitirdiğiniz kitapları ekleyin, puanlayın ve notlar alın
- **Okunacaklar**: Gelecekte okumak istediğiniz kitapları listeleyin
- **Kategori Sistemi**: Kitaplarınızı özel kategorilere ayırın
- **Arama ve Filtreleme**: Kitaplarınızı hızlıca bulun

### 👤 Kullanıcı Sistemi
- **Güvenli Giriş**: JWT tabanlı kimlik doğrulama
- **Profil Yönetimi**: Kişisel bilgilerinizi düzenleyin
- **İstatistikler**: Okuma alışkanlıklarınızı takip edin
- **Çok Kullanıcılı**: Her kullanıcının kendi kitap koleksiyonu

### 🎨 Modern Tasarım
- **Responsive**: Mobil ve masaüstü uyumlu
- **Glassmorphism**: Modern cam efektli tasarım
- **Koyu/Açık Tema**: Tercih ettiğiniz tema ile kullanın
- **Animasyonlar**: Akıcı kullanıcı deneyimi

## 🚀 Canlı Demo

**Live Site**: [Buraya tıklayın](https://kitap-arsivim.vercel.app) *(Deployment sonrası güncellenecek)*

**Test Kullanıcısı**: 
- Kullanıcı Adı: `demo`
- Şifre: `demo123`

## 🛠️ Teknoloji Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **JWT** - Token tabanlı auth
- **bcryptjs** - Şifre hashleme

### Frontend
- **Vanilla JavaScript** - Modern ES6+ özellikler
- **HTML5** - Semantik markup
- **CSS3** - Flexbox, Grid, Animations
- **Responsive Design** - Mobile-first approach

### Güvenlik
- **Helmet** - HTTP header güvenliği
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API istek sınırlandırma
- **Input Validation** - Veri doğrulama

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB
- Git

### Local Development

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/[USERNAME]/kitap-arsivim.git
cd kitap-arsivim
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
MONGODB_URI=mongodb://localhost:27017/kitaparsivim
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
```

4. **MongoDB'yi başlatın**
```bash
mongod
```

5. **Uygulamayı çalıştırın**
```bash
npm start
```

6. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🌐 Production Deployment

### Vercel ile Deployment

1. **GitHub'a push edin**
2. **Vercel'e bağlanın**: [vercel.com](https://vercel.com)
3. **Repository'yi import edin**
4. **Environment variables ekleyin**:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Güçlü bir secret key
   - `NODE_ENV`: `production`

### MongoDB Atlas Setup

1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Ücretsiz cluster oluşturun
3. Connection string'i alın
4. Vercel'de `MONGODB_URI` olarak ekleyin

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgileri
- `POST /api/auth/logout` - Çıkış

### Books
- `GET /api/books` - Kitapları listele
- `POST /api/books` - Yeni kitap ekle
- `PUT /api/books/:id` - Kitap güncelle
- `DELETE /api/books/:id` - Kitap sil

### Categories
- `GET /api/categories` - Kategorileri listele
- `POST /api/categories` - Kategori ekle
- `PUT /api/categories/:id` - Kategori güncelle
- `DELETE /api/categories/:id` - Kategori sil

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit'leyin (`git commit -am 'Yeni özellik eklendi'`)
4. Push'layın (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Kitap Arşivim Ekibi**
- 📧 Email: kitaparsivim@gmail.com
- 🌐 Website: [kitap-arsivim.vercel.app](https://kitap-arsivim.vercel.app)

## 🌟 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! ⭐ vermeyi unutmayın.

---

Made with ❤️ in Turkey 