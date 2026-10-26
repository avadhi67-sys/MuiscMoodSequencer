const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');

const seedDatabase = async () => {
    try {
        // 1. Seed Default Admin & User
        const adminExists = await User.findOne({ email: 'admin@sonicflow.com' });
        let adminUser = adminExists;
        if (!adminExists) {
            adminUser = await User.create({
                name: 'Sonic Administrator',
                email: 'admin@sonicflow.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('👑 Default Admin created: admin@sonicflow.com / admin123');
        }

        const userExists = await User.findOne({ email: 'user@sonicflow.com' });
        if (!userExists) {
            await User.create({
                name: 'Alex Turner',
                email: 'user@sonicflow.com',
                password: 'user123',
                role: 'user'
            });
            console.log('🎧 Default User created: user@sonicflow.com / user123');
        }

        // 2. Seed Artists
        const artistCount = await Artist.countDocuments();
        if (artistCount === 0) {
            const sampleArtists = [
                {
                    name: 'Acoustic Horizon',
                    mood: 'Calm',
                    bio: 'Warm organic acoustic melodies blended with smooth ambient undertones.',
                    image: '/images/covers/cover-1.png'
                },
                {
                    name: 'Luna Waves',
                    mood: 'Dreamy',
                    bio: 'Ethereal atmospheric soundscapes designed for introspection and flow state.',
                    image: '/images/covers/cover-2.png'
                },
                {
                    name: 'Volt Rhythm',
                    mood: 'Energetic',
                    bio: 'High-octane electronic synth rhythms and dynamic dance pacing.',
                    image: '/images/covers/cover-3.png'
                },
                {
                    name: 'Coastal Echoes',
                    mood: 'Chill',
                    bio: 'Gentle chillout waves and acoustic resonance inspired by the ocean.',
                    image: '/images/covers/cover-4.png'
                },
                {
                    name: 'Solar Drift',
                    mood: 'Happy',
                    bio: 'Uplifting feel-good indie grooves celebrating life and adventure.',
                    image: '/images/covers/cover-5.png'
                }
            ];
            await Artist.insertMany(sampleArtists);
            console.log(`🎤 Seeded ${sampleArtists.length} default artists into MongoDB`);
        }

        // 3. Seed Songs
        const songCount = await Song.countDocuments();
        if (songCount === 0) {
            const adminId = adminUser ? adminUser._id : null;
            const sampleSongs = [
                {
                    title: 'Calm Horizon',
                    artist: 'Acoustic Horizon',
                    mood: 'Calm',
                    energy: 3,
                    tempo: 76,
                    audioUrl: '/assets/audio/calm-romantic.mp3',
                    imageUrl: '/images/covers/cover-1.png',
                    createdBy: adminId
                },
                {
                    title: 'Dreamy Reverie',
                    artist: 'Luna Waves',
                    mood: 'Dreamy',
                    energy: 4,
                    tempo: 88,
                    audioUrl: '/assets/audio/dreamy.mp3',
                    imageUrl: '/images/covers/cover-2.png',
                    createdBy: adminId
                },
                {
                    title: 'Energetic Rush',
                    artist: 'Volt Rhythm',
                    mood: 'Energetic',
                    energy: 9,
                    tempo: 132,
                    audioUrl: '/assets/audio/energetic.mp3',
                    imageUrl: '/images/covers/cover-3.png',
                    createdBy: adminId
                },
                {
                    title: 'Hyper Velocity',
                    artist: 'Volt Rhythm',
                    mood: 'Energetic',
                    energy: 8,
                    tempo: 126,
                    audioUrl: '/assets/audio/energetic2.mp3',
                    imageUrl: '/images/covers/cover-4.png',
                    createdBy: adminId
                },
                {
                    title: 'Velvet Moonlight',
                    artist: 'Acoustic Horizon',
                    mood: 'Romantic',
                    energy: 4,
                    tempo: 82,
                    audioUrl: '/assets/audio/romantic.mp3',
                    imageUrl: '/images/covers/cover-5.png',
                    createdBy: adminId
                },
                {
                    title: 'Sand & Surfs',
                    artist: 'Coastal Echoes',
                    mood: 'Chill',
                    energy: 5,
                    tempo: 98,
                    audioUrl: '/assets/audio/sand-surfs.mp3',
                    imageUrl: '/images/covers/cover-1.png',
                    createdBy: adminId
                },
                {
                    title: 'Smooth Waters',
                    artist: 'Coastal Echoes',
                    mood: 'Calm',
                    energy: 3,
                    tempo: 72,
                    audioUrl: '/assets/audio/smooth-waters.mp3',
                    imageUrl: '/images/covers/cover-2.png',
                    createdBy: adminId
                },
                {
                    title: 'Summer Adventure',
                    artist: 'Solar Drift',
                    mood: 'Happy',
                    energy: 7,
                    tempo: 118,
                    audioUrl: '/assets/audio/summer-adventure.mp3',
                    imageUrl: '/images/covers/cover-3.png',
                    createdBy: adminId
                }
            ];
            await Song.insertMany(sampleSongs);
            console.log(`🎵 Seeded ${sampleSongs.length} default songs into MongoDB`);
        }
    } catch (error) {
        console.error('⚠️ Seeding error:', error);
    }
};

module.exports = seedDatabase;
