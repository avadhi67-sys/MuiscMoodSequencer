const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const Artist = require('../models/Artist');

// @desc    Get all songs with optional search, mood and artist filters
// @route   GET /api/songs, /songs
// @access  Public
const getAllSongs = async (req, res) => {
    try {
        const { search, mood, artist, sort } = req.query;
        let query = {};

        if (search) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [{ title: regex }, { artist: regex }, { mood: regex }];
        }

        if (mood && mood !== 'all') {
            query.mood = new RegExp(`^${mood.trim()}$`, 'i');
        }

        if (artist && artist !== 'all') {
            query.artist = new RegExp(`^${artist.trim()}$`, 'i');
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'tempo') sortOption = { tempo: 1 };
        if (sort === 'energy') sortOption = { energy: -1 };
        if (sort === 'title') sortOption = { title: 1 };

        const songs = await Song.find(query).sort(sortOption);

        res.json({
            success: true,
            count: songs.length,
            songs
        });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve songs: ' + error.message
        });
    }
};

// @desc    Get single song by ID
// @route   GET /api/songs/:id, /songs/:id
// @access  Public
const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found.'
            });
        }
        res.json({
            success: true,
            song
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add a new song to catalog (Admin / Postman)
// @route   POST /api/songs, /songs
// @access  Admin / Protected
const createSong = async (req, res) => {
    try {
        const { title, name, artist, mood, energy, tempo, audioUrl: customAudioUrl, imageUrl: customImageUrl } = req.body;

        const finalTitle = (title || name || '').trim();
        const finalArtist = (artist || 'Sonic Creator').trim();
        const finalMood = (mood || 'Calm').trim();

        if (!finalTitle) {
            return res.status(400).json({
                success: false,
                message: 'Please provide song title (or name).'
            });
        }

        let audioPath = customAudioUrl || '';
        let imagePath = customImageUrl || '';

        // Handle uploaded audio file via Multer
        if (req.files && req.files.audio && req.files.audio[0]) {
            audioPath = `/uploads/audio/${req.files.audio[0].filename}`;
        }

        // Handle uploaded cover image via Multer
        if (req.files && req.files.cover && req.files.cover[0]) {
            imagePath = `/uploads/covers/${req.files.cover[0].filename}`;
        }

        // Fallback sample audio if testing via Postman with JSON
        if (!audioPath) {
            const sampleAudioList = [
                '/assets/audio/calm-romantic.mp3',
                '/assets/audio/dreamy.mp3',
                '/assets/audio/energetic.mp3',
                '/assets/audio/energetic2.mp3',
                '/assets/audio/romantic.mp3',
                '/assets/audio/sand-surfs.mp3',
                '/assets/audio/smooth-waters.mp3',
                '/assets/audio/summer-adventure.mp3'
            ];
            audioPath = sampleAudioList[Math.floor(Math.random() * sampleAudioList.length)];
        }

        // Fallback cover if none provided
        if (!imagePath) {
            const coverIndex = (Math.floor(Math.random() * 5) + 1);
            imagePath = `/images/covers/cover-${coverIndex}.png`;
        }

        const newSong = await Song.create({
            title: finalTitle,
            artist: finalArtist,
            mood: finalMood,
            energy: Number(energy) || 6,
            tempo: Number(tempo) || 120,
            audioUrl: audioPath,
            imageUrl: imagePath,
            createdBy: req.user ? req.user._id : null
        });

        // Auto-register artist in Artist collection in MongoDB
        const artistExists = await Artist.findOne({
            name: new RegExp(`^${finalArtist}$`, 'i')
        });
        if (!artistExists) {
            await Artist.create({
                name: finalArtist,
                mood: finalMood,
                bio: `Creator profile on SonicFlow.`,
                image: imagePath
            });
        }

        res.status(201).json({
            success: true,
            message: 'Song added successfully to MongoDB!',
            song: newSong
        });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add song: ' + error.message
        });
    }
};

// @desc    Update a song
// @route   PUT /api/songs/:id, /songs/:id
// @access  Admin
const updateSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found.'
            });
        }

        const { title, name, artist, mood, energy, tempo, imageUrl, audioUrl } = req.body;

        if (title || name) song.title = (title || name).trim();
        if (artist) song.artist = artist.trim();
        if (mood) song.mood = mood.trim();
        if (energy !== undefined) song.energy = Number(energy);
        if (tempo !== undefined) song.tempo = Number(tempo);
        if (imageUrl) song.imageUrl = imageUrl;
        if (audioUrl) song.audioUrl = audioUrl;

        if (req.files && req.files.audio && req.files.audio[0]) {
            song.audioUrl = `/uploads/audio/${req.files.audio[0].filename}`;
        }
        if (req.files && req.files.cover && req.files.cover[0]) {
            song.imageUrl = `/uploads/covers/${req.files.cover[0].filename}`;
        }

        await song.save();

        res.json({
            success: true,
            message: 'Song updated successfully in MongoDB.',
            song
        });
    } catch (error) {
        console.error('Error updating song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update song: ' + error.message
        });
    }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id, /songs/:id
// @access  Admin
const deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found.'
            });
        }

        if (song.audioUrl && song.audioUrl.startsWith('/uploads/')) {
            const fullAudioPath = path.join(__dirname, '..', song.audioUrl);
            if (fs.existsSync(fullAudioPath)) {
                try {
                    fs.unlinkSync(fullAudioPath);
                } catch (e) {}
            }
        }

        await Song.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: `"${song.title}" was deleted from MongoDB.`
        });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete song: ' + error.message
        });
    }
};

module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong
};
