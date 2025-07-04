const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

const app = express();

// Güvenlik middleware'leri
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors({
    origin: true,
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB bağlantısı
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && cachedConnection.readyState === 1) {
        return true;
    }
    
    try {
        if (process.env.MONGODB_URI) {
            cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                bufferCommands: false,
                bufferMaxEntries: 0,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
            });
            console.log('✅ MongoDB bağlantısı başarılı');
            return true;
        }
    } catch (err) {
        console.error('❌ MongoDB bağlantı hatası:', err);
    }
    
    console.log('⚠️ Test modu etkin');
    return false;
}

// Test modu için veri
if (!global.testMode) {
    global.testMode = {
        users: [
            {
                id: '1',
                username: 'admin',
                email: 'admin@test.com',
                password: '$2a$10$gDUmgeSDOF0eQ2jYOTojPugyaloBWnW9vBrR86LQ2qPY8aLwl4/Dm', // 123456
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
}

// Database connection middleware
app.use(async (req, res, next) => {
    req.isMongoConnected = await connectToDatabase();
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mongodb: req.isMongoConnected ? 'connected' : 'test-mode',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Auth sayfası
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
});

// 404 handler
app.use('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ 
            error: 'API endpoint bulunamadı',
            path: req.path
        });
    } else {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Sunucu hatası',
        message: err.message
    });
});

// Vercel serverless function export
module.exports = app; 