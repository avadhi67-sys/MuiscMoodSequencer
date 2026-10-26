const Song = require('../models/Song');
const Artist = require('../models/Artist');
const User = require('../models/User');

// @desc    Get system overview statistics (Admin only)
// @route   GET /api/stats, /stats
// @access  Admin / Protected
const getSystemStats = async (req, res) => {
    try {
        const [totalSongs, totalArtists, totalUsers] = await Promise.all([
            Song.countDocuments(),
            Artist.countDocuments(),
            User.countDocuments()
        ]);

        const songs = await Song.find().select('mood energy tempo');

        const moodCounts = {};
        let totalEnergy = 0;
        let totalTempo = 0;

        songs.forEach((song) => {
            const mood = (song.mood || 'Unassigned').trim();
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
            totalEnergy += Number(song.energy) || 0;
            totalTempo += Number(song.tempo) || 0;
        });

        const uniqueMoods = Object.keys(moodCounts).length;
        const averageEnergy = songs.length > 0 ? Number((totalEnergy / songs.length).toFixed(1)) : 0;
        const averageTempo = songs.length > 0 ? Math.round(totalTempo / songs.length) : 0;

        res.json({
            success: true,
            stats: {
                totalSongs,
                totalArtists,
                totalUsers,
                uniqueMoods,
                averageEnergy,
                averageTempo,
                moodDistribution: moodCounts
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve stats: ' + error.message
        });
    }
};

module.exports = {
    getSystemStats
};
