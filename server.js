const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

const app = express();

// Güvenlik middleware'leri
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // maksimum 100 istek
    message: {
        error: 'Çok fazla istek gönderdiniz. 15 dakika sonra tekrar deneyin.'
    }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (frontend)
app.use(express.static('public'));

// MongoDB bağlantısı
let isMongoConnected = false;

// Vercel'de her request'te bağlantı kontrolü
async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return true;
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kitaparsivim', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB bağlantısı başarılı');
        return true;
    } catch (err) {
        console.error('❌ MongoDB bağlantı hatası:', err);
        console.log('⚠️  MongoDB bulunamadı. Test modu etkinleştiriliyor...');
        return false;
    }
}

// Test modu için geçici veri store
global.testMode = {
    users: [
        {
            id: '1',
            username: 'admin',
            email: 'admin@test.com',
            password: '$2a$10$gDUmgeSDOF0eQ2jYOTojPugyaloBWnW9vBrR86LQ2qPY8aLwl4/Dm', // password: 123456
            books: [],
            categories: [
                { id: '1', name: 'Roman', color: '#FF6B6B', description: 'Edebiyat romanları' },
                { id: '2', name: 'Bilim Kurgu', color: '#4ECDC4', description: 'Bilim kurgu kitapları' },
                { id: '3', name: 'Tarih', color: '#45B7D1', description: 'Tarih kitapları' }
            ]
        }
    ],
    books: [],
    categories: []
};

// MongoDB bağlantı durumunu kontrol eden middleware
app.use(async (req, res, next) => {
    req.isMongoConnected = await connectToDatabase();
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Sayfa bulunamadı',
        message: 'Bu endpoint mevcut değil.' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Sunucu hatası',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu.'
    });
});

// Vercel için export
module.exports = app; 