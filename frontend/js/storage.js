// ============================================
// SONICFLOW 2.0
// MONGODB & REST API STORAGE ENGINE
// Replaces IndexedDB & LocalStorage with Express REST APIs
// ============================================

console.log("💾 SonicFlow MongoDB API Storage Engine Initializing...");

const API_BASE = (typeof window !== "undefined" && window.API_BASE !== undefined) ? window.API_BASE : "";

// Helper to resolve relative backend URLs (uploads / static assets) when backend is deployed
function resolveMediaUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) {
        return url;
    }
    if (!API_BASE) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeSong(s) {
    if (!s) return s;
    return {
        ...s,
        audioUrl: resolveMediaUrl(s.audioUrl),
        imageUrl: resolveMediaUrl(s.imageUrl)
    };
}

function normalizeArtist(a) {
    if (!a) return a;
    return {
        ...a,
        image: resolveMediaUrl(a.image)
    };
}

// Helper to get auth headers
function getAuthHeaders(isJson = true) {
    const headers = {};
    if (isJson) {
        headers["Content-Type"] = "application/json";
    }
    const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

// ============================================
// SONGS API
// ============================================

/**
 * Fetch all songs from MongoDB via Express API
 */
async function getSongsFromStorage() {
    try {
        const response = await fetch(`${API_BASE}/api/songs`, {
            headers: getAuthHeaders(true),
            credentials: "include"
        });

        if (!response.ok) {
            console.warn(`Failed to fetch songs from API: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return (data.songs || []).map(normalizeSong);
    } catch (error) {
        console.error("❌ Error fetching songs from MongoDB:", error);
        return [];
    }
}

/**
 * Get single song by ID
 */
async function getSongByIdFromStorage(id) {
    try {
        const response = await fetch(`${API_BASE}/api/songs/${id}`, {
            headers: getAuthHeaders(true),
            credentials: "include"
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.song ? normalizeSong(data.song) : null;
    } catch (error) {
        console.error("❌ Error fetching song by ID:", error);
        return null;
    }
}

/**
 * Save / Create a new song (Admin only)
 * Supports both FormData (with file uploads) and JSON object
 */
async function saveSong(song) {
    try {
        let options = {
            method: "POST",
            credentials: "include"
        };

        if (song instanceof FormData) {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
            options.body = song;
        } else {
            // Build FormData if file exists, or JSON
            if (song.audioFile instanceof File || song.audioFile instanceof Blob) {
                const formData = new FormData();
                formData.append("title", song.title || "");
                formData.append("artist", song.artist || "");
                formData.append("mood", song.mood || "");
                formData.append("energy", song.energy || 5);
                formData.append("tempo", song.tempo || 120);
                formData.append("audio", song.audioFile);
                if (song.imageFile instanceof File) {
                    formData.append("cover", song.imageFile);
                } else if (song.image) {
                    formData.append("imageUrl", song.image);
                }
                const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
                options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
                options.body = formData;
            } else {
                options.headers = getAuthHeaders(true);
                options.body = JSON.stringify({
                    title: song.title,
                    artist: song.artist,
                    mood: song.mood,
                    energy: song.energy,
                    tempo: song.tempo,
                    audioUrl: song.audioUrl || song.audio || "",
                    imageUrl: song.image || song.imageUrl || ""
                });
            }
        }

        const response = await fetch(`${API_BASE}/api/songs`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to save song to database.");
        }

        console.log("🎵 Song saved in MongoDB:", result.song ? result.song.title : "Success");
        return result.song ? result.song.id : true;
    } catch (error) {
        console.error("❌ Error saving song:", error);
        throw error;
    }
}

/**
 * Update a song (Admin only)
 */
async function updateSong(id, updateData) {
    try {
        let options = {
            method: "PUT",
            credentials: "include"
        };

        if (updateData instanceof FormData) {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
            options.body = updateData;
        } else {
            options.headers = getAuthHeaders(true);
            options.body = JSON.stringify(updateData);
        }

        const response = await fetch(`${API_BASE}/api/songs/${id}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update song.");
        }

        return result.song || true;
    } catch (error) {
        console.error("❌ Error updating song:", error);
        throw error;
    }
}

/**
 * Delete a song from MongoDB (Admin only)
 */
async function deleteSong(id) {
    try {
        const response = await fetch(`${API_BASE}/api/songs/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(true),
            credentials: "include"
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to delete song.");
        }

        console.log("🗑️ Song deleted from MongoDB:", id);
        return true;
    } catch (error) {
        console.error("❌ Error deleting song:", error);
        throw error;
    }
}

// ============================================
// ARTISTS API
// ============================================

/**
 * Get all artist profiles from MongoDB
 */
async function getAllArtistProfiles() {
    try {
        const response = await fetch(`${API_BASE}/api/artists`, {
            headers: getAuthHeaders(true),
            credentials: "include"
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return (data.artists || []).map(normalizeArtist);
    } catch (error) {
        console.error("❌ Error fetching artists from MongoDB:", error);
        return [];
    }
}

/**
 * Save new artist profile (Admin only)
 */
async function saveArtistProfile(artist) {
    try {
        let options = {
            method: "POST",
            credentials: "include"
        };

        if (artist instanceof FormData) {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
            options.body = artist;
        } else if (artist.imageFile instanceof File) {
            const formData = new FormData();
            formData.append("name", artist.name || "");
            formData.append("mood", artist.mood || "");
            formData.append("bio", artist.bio || "");
            formData.append("image", artist.imageFile);
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
            options.body = formData;
        } else {
            options.headers = getAuthHeaders(true);
            options.body = JSON.stringify({
                name: artist.name,
                mood: artist.mood || "",
                bio: artist.bio || "",
                image: artist.image || ""
            });
        }

        const response = await fetch(`${API_BASE}/api/artists`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to save artist profile.");
        }

        console.log("🎤 Artist profile saved in MongoDB:", result.artist ? result.artist.name : "Success");
        return result.artist || true;
    } catch (error) {
        console.error("❌ Error saving artist profile:", error);
        throw error;
    }
}

/**
 * Update artist profile (Admin only)
 */
async function updateArtistProfile(id, updateData) {
    try {
        let options = {
            method: "PUT",
            credentials: "include"
        };

        if (updateData instanceof FormData) {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            options.headers = token ? { "Authorization": `Bearer ${token}` } : {};
            options.body = updateData;
        } else {
            options.headers = getAuthHeaders(true);
            options.body = JSON.stringify(updateData);
        }

        const response = await fetch(`${API_BASE}/api/artists/${id}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update artist.");
        }

        return result.artist || true;
    } catch (error) {
        console.error("❌ Error updating artist:", error);
        throw error;
    }
}

/**
 * Delete artist profile (Admin only)
 */
async function deleteArtistProfile(idOrName) {
    try {
        let targetId = idOrName;

        // If a name was passed instead of MongoDB ObjectId, look up the artist first
        if (!/^[0-9a-fA-F]{24}$/.test(idOrName)) {
            const artists = await getAllArtistProfiles();
            const found = artists.find(a => a.name.toLowerCase() === idOrName.toLowerCase());
            if (found && found.id) {
                targetId = found.id;
            }
        }

        const response = await fetch(`${API_BASE}/api/artists/${targetId}`, {
            method: "DELETE",
            headers: getAuthHeaders(true),
            credentials: "include"
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to delete artist.");
        }

        console.log("🗑️ Artist deleted from MongoDB:", idOrName);
        return true;
    } catch (error) {
        console.error("❌ Error deleting artist:", error);
        throw error;
    }
}

console.log("💾 SonicFlow MongoDB REST API Storage Ready");
