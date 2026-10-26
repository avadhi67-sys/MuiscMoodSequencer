const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const seedDatabase = require('./seed/seeder');

const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const artistRoutes = require('./routes/artistRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas & Seed Database
connectDB().then(async () => {
    try {
        await seedDatabase();
    } catch (e) {
        console.warn('⚠️ Seeding notice:', e.message);
    }
});

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static File Directories
const uploadsPath = path.join(__dirname, 'uploads');
const localAssetsPath = path.join(__dirname, 'assets');
const frontendAssetsPath = path.join(__dirname, '..', 'frontend', 'assets');
const localImagesPath = path.join(__dirname, 'images');
const frontendImagesPath = path.join(__dirname, '..', 'frontend', 'images');

app.use('/uploads', express.static(uploadsPath));
if (fs.existsSync(localAssetsPath)) {
    app.use('/assets', express.static(localAssetsPath));
} else if (fs.existsSync(frontendAssetsPath)) {
    app.use('/assets', express.static(frontendAssetsPath));
}

if (fs.existsSync(localImagesPath)) {
    app.use('/images', express.static(localImagesPath));
} else if (fs.existsSync(frontendImagesPath)) {
    app.use('/images', express.static(frontendImagesPath));
}

// Health Check Endpoint (useful for cloud deployment health monitors)
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'SonicFlow Backend API is healthy and operational',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// REST API ROUTES (MVC Architecture)
// ============================================

// 1. Songs Routes
app.use('/api/songs', songRoutes);
app.use('/songs', songRoutes);

// 2. Artists Routes
app.use('/api/artists', artistRoutes);
app.use('/artists', artistRoutes);

// 3. Auth Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// 4. Direct Users Route for Postman convenience
app.use('/api/users', authRoutes);
app.use('/users', (req, res, next) => {
    if (req.method === 'POST') {
        req.url = '/register';
    }
    return authRoutes(req, res, next);
});

// 5. Direct Register & Login Shortcuts for Postman
app.post('/register', (req, res, next) => {
    req.url = '/register';
    return authRoutes(req, res, next);
});
app.post('/login', (req, res, next) => {
    req.url = '/login';
    return authRoutes(req, res, next);
});

// 6. Stats Route
app.use('/api/stats', statsRoutes);
app.use('/stats', statsRoutes);

// Optional: Serve frontend static files if frontend folder exists alongside backend
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.use('/css', express.static(path.join(frontendPath, 'css')));
    app.use('/js', express.static(path.join(frontendPath, 'js')));
    app.use('/assets', express.static(path.join(frontendPath, 'assets')));
    app.use('/images', express.static(path.join(frontendPath, 'images')));

    // Clean page routes
    app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
    app.get('/admin', (req, res) => res.sendFile(path.join(frontendPath, 'admin-dashboard.html')));
    app.get('/admin-dashboard', (req, res) => res.sendFile(path.join(frontendPath, 'admin-dashboard.html')));
    app.get('/user', (req, res) => res.sendFile(path.join(frontendPath, 'user-dashboard.html')));
    app.get('/user-dashboard', (req, res) => res.sendFile(path.join(frontendPath, 'user-dashboard.html')));
    app.get('/login', (req, res) => res.sendFile(path.join(frontendPath, 'login.html')));
    app.get('/signup', (req, res) => res.sendFile(path.join(frontendPath, 'signup.html')));
    app.get('/library', (req, res) => res.sendFile(path.join(frontendPath, 'library.html')));
    app.get('/sequencer', (req, res) => res.sendFile(path.join(frontendPath, 'sequencer.html')));
    app.get('/artists', (req, res) => res.sendFile(path.join(frontendPath, 'artists.html')));
    app.get('/search', (req, res) => res.sendFile(path.join(frontendPath, 'search.html')));
}

// 404 & Error Handling Middleware (Syllabus: Error Handling Middleware)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SonicFlow Server running at: http://localhost:${PORT}`);
    console.log(`🌿 Connected to MongoDB Atlas Cloud Database!`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
    console.log(`--------------------------------------------------`);
    console.log(`📮 Postman Ready Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/songs`);
    console.log(`   POST http://localhost:${PORT}/api/songs`);
    console.log(`   GET  http://localhost:${PORT}/api/artists`);
    console.log(`   POST http://localhost:${PORT}/api/artists`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/users`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   GET  http://localhost:${PORT}/api/stats`);
    console.log(`==================================================\n`);
});
