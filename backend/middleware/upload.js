const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const audioDir = path.join(__dirname, '..', 'uploads', 'audio');
const coversDir = path.join(__dirname, '..', 'uploads', 'covers');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}
if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'audio') {
            cb(null, audioDir);
        } else {
            cb(null, coversDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `${uniqueSuffix}-${cleanName}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'audio') {
        if (file.mimetype.startsWith('audio/') || file.originalname.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid audio file format. Supported: MP3, WAV, OGG, M4A.'), false);
        }
    } else if (file.fieldname === 'cover' || file.fieldname === 'image') {
        if (file.mimetype.startsWith('image/') || file.originalname.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image file format. Supported: PNG, JPG, JPEG, WEBP.'), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    fileFilter: fileFilter
});

module.exports = upload;
