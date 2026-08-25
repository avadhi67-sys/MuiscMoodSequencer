// ============================================
// SONICFLOW 2.0
// STORAGE ENGINE
// ============================================
//
// Uses IndexedDB to store:
// 1. Song information
// 2. Uploaded audio file
//
// ============================================

const DB_NAME = "SonicFlowDB";
const DB_VERSION = 1;
const STORE_NAME = "songs";


// ============================================
// OPEN DATABASE
// ============================================

function openDatabase() {

    return new Promise(function(resolve, reject) {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        // ----------------------------------------
        // CREATE DATABASE / OBJECT STORE
        // ----------------------------------------

        request.onupgradeneeded =
            function(event) {

                const db =
                    event.target.result;


                if (
                    !db.objectStoreNames.contains(
                        STORE_NAME
                    )
                ) {

                    const store =
                        db.createObjectStore(
                            STORE_NAME,
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );


                    // Indexes for searching/filtering

                    store.createIndex(
                        "title",
                        "title",
                        {
                            unique: false
                        }
                    );


                    store.createIndex(
                        "artist",
                        "artist",
                        {
                            unique: false
                        }
                    );


                    store.createIndex(
                        "mood",
                        "mood",
                        {
                            unique: false
                        }
                    );

                }

            };


        // ----------------------------------------
        // SUCCESS
        // ----------------------------------------

        request.onsuccess =
            function(event) {

                const db =
                    event.target.result;

                resolve(db);

            };


        // ----------------------------------------
        // ERROR
        // ----------------------------------------

        request.onerror =
            function(event) {

                console.error(
                    "❌ IndexedDB error:",
                    event.target.error
                );

                reject(
                    event.target.error
                );

            };

    });

}


// ============================================
// ADD SONG
// ============================================

function saveSong(song) {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.add(song);


                request.onsuccess =
                    function(event) {

                        console.log(
                            "🎵 Song saved successfully"
                        );


                        resolve(
                            event.target.result
                        );

                    };


                request.onerror =
                    function(event) {

                        console.error(
                            "❌ Could not save song:",
                            event.target.error
                        );


                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                console.error(
                    "❌ Storage error:",
                    error
                );

                reject(error);

            }

        }
    );

}


// ============================================
// GET ALL SONGS
// ============================================

function getSongsFromStorage() {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    function(event) {

                        const songs =
                            event.target.result;


                        resolve(
                            songs
                        );

                    };


                request.onerror =
                    function(event) {

                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                reject(error);

            }

        }
    );

}


// ============================================
// GET SONG BY ID
// ============================================

function getSongFromStorage(id) {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.get(
                        Number(id)
                    );


                request.onsuccess =
                    function(event) {

                        resolve(
                            event.target.result
                        );

                    };


                request.onerror =
                    function(event) {

                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                reject(error);

            }

        }
    );

}


// ============================================
// UPDATE SONG
// ============================================

function updateSong(song) {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.put(song);


                request.onsuccess =
                    function() {

                        console.log(
                            "✦ Song updated"
                        );


                        resolve(true);

                    };


                request.onerror =
                    function(event) {

                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                reject(error);

            }

        }
    );

}


// ============================================
// DELETE SONG
// ============================================

function deleteSong(id) {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.delete(
                        Number(id)
                    );


                request.onsuccess =
                    function() {

                        console.log(
                            "🗑 Song deleted"
                        );


                        resolve(true);

                    };


                request.onerror =
                    function(event) {

                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                reject(error);

            }

        }
    );

}


// ============================================
// DELETE ALL SONGS
// ============================================

function clearAllSongs() {

    return new Promise(
        async function(resolve, reject) {

            try {

                const db =
                    await openDatabase();


                const transaction =
                    db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.clear();


                request.onsuccess =
                    function() {

                        console.log(
                            "🗑 All songs removed"
                        );


                        resolve(true);

                    };


                request.onerror =
                    function(event) {

                        reject(
                            event.target.error
                        );

                    };


                transaction.oncomplete =
                    function() {

                        db.close();

                    };

            }

            catch(error) {

                reject(error);

            }

        }
    );

}


// ============================================
// COUNT SONGS
// ============================================

async function getStoredSongCount() {

    const songs =
        await getSongsFromStorage();


    return songs.length;

}


// ============================================
// TEST STORAGE
// ============================================

async function testStorage() {

    try {

        const songs =
            await getSongsFromStorage();


        console.log(
            "🎵 SonicFlow Storage"
        );


        console.log(
            `Total songs: ${songs.length}`
        );


        console.table(
            songs
        );

    }

    catch(error) {

        console.error(
            "❌ Storage test failed:",
            error
        );

    }

}


// ============================================
// ARTIST PROFILES STORAGE
// ============================================

const ARTISTS_STORAGE_KEY = "sonicflow_custom_artists";

function getAllArtistProfiles() {
    try {
        const data = localStorage.getItem(ARTISTS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load artists from storage:", e);
        return [];
    }
}

function saveArtistProfile(artist) {
    try {
        const artists = getAllArtistProfiles();
        const trimmedName = (artist.name || "").trim();
        if (!trimmedName) return false;

        const existingIndex = artists.findIndex(function(a) {
            return a.name.toLowerCase() === trimmedName.toLowerCase();
        });

        const newProfile = {
            id: artist.id || `artist_${Date.now()}`,
            name: trimmedName,
            mood: artist.mood || "",
            bio: artist.bio || "",
            image: artist.image || "",
            updatedAt: Date.now()
        };

        if (existingIndex >= 0) {
            artists[existingIndex] = { ...artists[existingIndex], ...newProfile };
        } else {
            artists.push(newProfile);
        }

        localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(artists));
        console.log("🎤 Artist profile saved:", trimmedName);
        return newProfile;
    } catch (e) {
        console.error("Failed to save artist profile:", e);
        return false;
    }
}

function deleteArtistProfile(artistName) {
    try {
        const artists = getAllArtistProfiles();
        const filtered = artists.filter(function(a) {
            return a.name.toLowerCase() !== artistName.toLowerCase();
        });
        localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (e) {
        console.error("Failed to delete artist profile:", e);
        return false;
    }
}

// ============================================
// READY
// ============================================

console.log(
    "💾 SonicFlow storage loaded"
);