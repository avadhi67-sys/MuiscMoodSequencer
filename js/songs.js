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
// READY
// ============================================

console.log(
    "🎵 SonicFlow Songs module loaded"
);