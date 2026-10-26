const express = require('express');
const router = express.Router();
const {
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
    deleteArtist
} = require('../controllers/artistController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/artists
router.get('/', optionalAuth, getAllArtists);

// @route   GET /api/artists/:id
router.get('/:id', optionalAuth, getArtistById);

// @route   POST /api/artists
router.post('/', protect, adminOnly, upload.single('image'), createArtist);

// @route   PUT /api/artists/:id
router.put('/:id', protect, adminOnly, upload.single('image'), updateArtist);

// @route   DELETE /api/artists/:id
router.delete('/:id', protect, adminOnly, deleteArtist);

module.exports = router;
