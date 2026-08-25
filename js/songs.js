// ============================================
// SONICFLOW 2.0
// SONGS
// ============================================
//
// This file does NOT contain hardcoded songs.
// Songs will come from storage.js.
//
// Flow:
//
// Add Song Form
//      ↓
// add-song.js
//      ↓
// storage.js
//      ↓
// songs.js
//      ↓
// Library / Sequencer / Player
//
// ============================================


// ============================================
// GET ALL SONGS
// ============================================

async function getAllSongs() {

    try {

        const songs = await getSongsFromStorage();

        return songs || [];

    } catch (error) {

        console.error(
            "❌ Error loading songs:",
            error
        );

        return [];

    }

}


// ============================================
// GET SONG BY ID
// ============================================

async function getSongById(id) {

    const songs = await getAllSongs();

    return songs.find(function(song) {

        return String(song.id) === String(id);

    });

}


// ============================================
// GET SONG BY TITLE
// ============================================

async function getSongByTitle(title) {

    const songs = await getAllSongs();

    return songs.find(function(song) {

        return song.title &&
            song.title.toLowerCase() ===
            title.toLowerCase();

    });

}


// ============================================
// SEARCH SONGS
// ============================================

async function searchSongs(query) {

    const songs = await getAllSongs();

    const searchText =
        query.toLowerCase().trim();


    if (searchText === "") {

        return songs;

    }


    return songs.filter(function(song) {

        const title =
            (song.title || "").toLowerCase();

        const artist =
            (song.artist || "").toLowerCase();

        const mood =
            (song.mood || "").toLowerCase();


        return (
            title.includes(searchText) ||
            artist.includes(searchText) ||
            mood.includes(searchText)
        );

    });

}


// ============================================
// FILTER BY MOOD
// ============================================

async function getSongsByMood(mood) {

    const songs = await getAllSongs();

    return songs.filter(function(song) {

        return (
            song.mood &&
            song.mood.toLowerCase() ===
            mood.toLowerCase()
        );

    });

}


// ============================================
// FILTER BY ENERGY
// ============================================

async function getSongsByEnergy(minEnergy, maxEnergy) {

    const songs = await getAllSongs();

    return songs.filter(function(song) {

        return (
            song.energy >= minEnergy &&
            song.energy <= maxEnergy
        );

    });

}


// ============================================
// FILTER BY TEMPO
// ============================================

async function getSongsByTempo(minBpm, maxBpm) {

    const songs = await getAllSongs();

    return songs.filter(function(song) {

        return (
            song.tempo >= minBpm &&
            song.tempo <= maxBpm
        );

    });

}


// ============================================
// GET SIMILAR SONGS
// ============================================
//
// Used by the Mood Sequencer.
//
// A song is considered similar when:
// - Mood is same
// - Energy is close
// - Tempo is close
//
// ============================================

async function getSimilarSongs(currentSong) {

    const songs = await getAllSongs();


    if (!currentSong) {

        return [];

    }


    return songs
        .filter(function(song) {

            // Don't compare song with itself

            if (
                String(song.id) ===
                String(currentSong.id)
            ) {

                return false;

            }


            return true;

        })
        .map(function(song) {

            const moodScore =
                song.mood === currentSong.mood
                    ? 1
                    : 0;


            const energyDifference =
                Math.abs(
                    song.energy -
                    currentSong.energy
                );


            const tempoDifference =
                Math.abs(
                    song.tempo -
                    currentSong.tempo
                );


            // Energy similarity

            const energyScore =
                Math.max(
                    0,
                    1 - energyDifference / 10
                );


            // Tempo similarity

            const tempoScore =
                Math.max(
                    0,
                    1 - tempoDifference / 100
                );


            // Final similarity score

            const score =
                (
                    moodScore * 0.5
                ) +
                (
                    energyScore * 0.3
                ) +
                (
                    tempoScore * 0.2
                );


            return {

                song: song,

                score: score

            };

        })
        .sort(function(a, b) {

            return b.score - a.score;

        });

}


// ============================================
// GET SONG COUNT
// ============================================

async function getSongCount() {

    const songs = await getAllSongs();

    return songs.length;

}


// ============================================
// DEBUG
// ============================================

async function showSongDatabase() {

    const songs = await getAllSongs();

    console.log(
        "🎵 SonicFlow Song Database"
    );

    console.log(
        `Total songs: ${songs.length}`
    );

    console.table(songs);

}


// ============================================
// CURATED RANDOM CARD COVERS & ARTWORK
// ============================================
<<<<<<< HEAD
// CUSTOM COVER ARTWORK COLLECTION
// 5 User-Uploaded Unique Aesthetic Covers
// ============================================

const CUSTOM_COVERS = [
    "images/covers/cover-1.png", // Halftone Vinyl Record in Hands
    "images/covers/cover-2.png", // Vinyl with Glitter Stars
    "images/covers/cover-3.png", // Half Vinyl Stereo Label
    "images/covers/cover-4.png", // Clear Cassette Tape
    "images/covers/cover-5.png"  // Yeezus Jewel Case CD
];

function getSongCoverImage(song) {
    if (!song) return CUSTOM_COVERS[0];

    // Check if song has an explicitly uploaded local data URI image
    if (song.image && typeof song.image === "string" && song.image.startsWith("data:")) {
        return song.image;
    }

    // Deterministic pseudo-random distribution across the 5 uploaded covers
=======

const MOOD_COVERS = {
    Romantic: [
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1520523839898-5071270868f7?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=600&auto=format&fit=crop&q=80"
    ],
    Energetic: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80"
    ],
    Calm: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80"
    ],
    Dreamy: [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80"
    ],
    Happy: [
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80"
    ],
    Emotional: [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1445985543469-433ecba627a0?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&auto=format&fit=crop&q=80"
    ],
    Melancholic: [
        "https://images.unsplash.com/photo-1445985543469-433ecba627a0?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
    ],
    Intense: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80"
    ],
    default: [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80"
    ]
};

function getSongCoverImage(song) {
    if (!song) return "";
    if (song.image && typeof song.image === "string" && song.image.trim() !== "") return song.image;
    if (song.cover && typeof song.cover === "string" && song.cover.trim() !== "") return song.cover;
    if (song.artwork && typeof song.artwork === "string" && song.artwork.trim() !== "") return song.artwork;

    const mood = (song.mood || "").trim();
    const pool = MOOD_COVERS[mood] || MOOD_COVERS.default;

>>>>>>> f488952eac721cff9e8db671353847099801d9b0
    const key = `${song.id || ""}_${song.title || ""}_${song.artist || ""}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0;
    }
<<<<<<< HEAD
    const index = Math.abs(hash) % CUSTOM_COVERS.length;
    return CUSTOM_COVERS[index];
=======
    const index = Math.abs(hash) % pool.length;
    return pool[index];
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
}

// ============================================
// READY
// ============================================

console.log(
    "🎵 SonicFlow Songs module loaded"
);