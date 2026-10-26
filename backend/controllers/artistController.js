const Artist = require('../models/Artist');
const Song = require('../models/Song');

// @desc    Get all artists with song counts
// @route   GET /api/artists, /artists
// @access  Public
const getAllArtists = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.name = new RegExp(search.trim(), 'i');
        }

        const artists = await Artist.find(query).sort({ name: 1 });
        const songs = await Song.find();

        const artistMap = {};
        songs.forEach((s) => {
            const key = (s.artist || '').toLowerCase().trim();
            if (key) {
                artistMap[key] = (artistMap[key] || 0) + 1;
            }
        });

        const artistsWithCounts = artists.map((a) => {
            const count = artistMap[a.name.toLowerCase().trim()] || 0;
            const obj = a.toJSON();
            obj.songCount = count;
            return obj;
        });

        res.json({
            success: true,
            count: artistsWithCounts.length,
            artists: artistsWithCounts
        });
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve artists: ' + error.message
        });
    }
};

// @desc    Get single artist by ID or name with their songs
// @route   GET /api/artists/:id, /artists/:id
// @access  Public
const getArtistById = async (req, res) => {
    try {
        let artist = null;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            artist = await Artist.findById(req.params.id);
        }
        if (!artist) {
            artist = await Artist.findOne({
                name: new RegExp(`^${decodeURIComponent(req.params.id).trim()}$`, 'i')
            });
        }

        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found.'
            });
        }

        const songs = await Song.find({
            artist: new RegExp(`^${artist.name.trim()}$`, 'i')
        });

        res.json({
            success: true,
            artist: artist.toJSON(),
            songs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new artist (Admin)
// @route   POST /api/artists, /artists
// @access  Admin / Protected
const createArtist = async (req, res) => {
    try {
        const { name, title, mood, bio, image: customImage } = req.body;
        const artistName = (name || title || '').trim();

        if (!artistName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the artist name.'
            });
        }

        let artist = await Artist.findOne({
            name: new RegExp(`^${artistName}$`, 'i')
        });
        if (artist) {
            return res.status(200).json({
                success: true,
                message: `Artist "${artist.name}" already exists in MongoDB Atlas.`,
                artist: artist.toJSON()
            });
        }

        let imagePath = customImage || '';
        if (req.file) {
            imagePath = `/uploads/covers/${req.file.filename}`;
        }
        if (!imagePath) {
            const coverIndex = Math.floor(Math.random() * 5) + 1;
            imagePath = `/images/covers/cover-${coverIndex}.png`;
        }

        artist = await Artist.create({
            name: artistName,
            mood: (mood || 'Eclectic').trim(),
            bio: (bio || 'SonicFlow featured creator.').trim(),
            image: imagePath
        });

        res.status(201).json({
            success: true,
            message: 'Artist created successfully in MongoDB Atlas!',
            artist: artist.toJSON()
        });
    } catch (error) {
        console.error('Error creating artist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create artist: ' + error.message
        });
    }
};

// @desc    Update artist details
// @route   PUT /api/artists/:id, /artists/:id
// @access  Admin / Protected
const updateArtist = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found.'
            });
        }

        const { name, mood, bio, image: customImage } = req.body;
        const oldName = artist.name;

        if (name) artist.name = name.trim();
        if (mood !== undefined) artist.mood = mood.trim();
        if (bio !== undefined) artist.bio = bio.trim();
        if (customImage) artist.image = customImage;
        if (req.file) {
            artist.image = `/uploads/covers/${req.file.filename}`;
        }

        await artist.save();

        // Update artist name on songs if name changed
        if (name && name.trim() !== oldName) {
            await Song.updateMany(
                { artist: oldName },
                { $set: { artist: name.trim() } }
            );
        }

        res.json({
            success: true,
            message: 'Artist updated successfully in MongoDB.',
            artist: artist.toJSON()
        });
    } catch (error) {
        console.error('Error updating artist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update artist: ' + error.message
        });
    }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id, /artists/:id
// @access  Admin / Protected
const deleteArtist = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found.'
            });
        }

        await Artist.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: `Artist "${artist.name}" was deleted successfully.`
        });
    } catch (error) {
        console.error('Error deleting artist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete artist: ' + error.message
        });
    }
};

module.exports = {
    getAllArtists,
    getArtistById,
    createArtist,
    updateArtist,
    deleteArtist
};
