const express = require('express');
const router = express.Router();
const {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong
} = require('../controllers/songController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/songs
router.get('/', optionalAuth, getAllSongs);

// @route   GET /api/songs/:id
router.get('/:id', optionalAuth, getSongById);

// @route   POST /api/songs
router.post(
    '/',
    protect,
    adminOnly,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    createSong
);

// @route   PUT /api/songs/:id
router.put(
    '/:id',
    protect,
    adminOnly,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    updateSong
);

// @route   DELETE /api/songs/:id
router.delete('/:id', protect, adminOnly, deleteSong);

module.exports = router;
