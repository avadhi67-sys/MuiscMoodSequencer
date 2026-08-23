// ==========================================================================
// SONICFLOW ARTISTS CONTROLLER
// Groups music catalog by Artist signatures, tracks & moods
// ==========================================================================

(function () {
    "use strict";

    console.log("🎤 SonicFlow Artists module loading...");

    // DOM Elements
    const artistGrid = document.getElementById("artistGrid");
    const emptyArtists = document.getElementById("emptyArtists");
    const totalArtistsEl = document.getElementById("totalArtists");
    const totalArtistArtworksEl = document.getElementById("totalArtistArtworks");
    const totalArtistTracksEl = document.getElementById("totalArtistTracks");
    const artistCountBadge = document.getElementById("artistCountBadge");
    const artistSearch = document.getElementById("artistSearch");

    // Modal Elements
    const modalOverlay = document.getElementById("artistModalOverlay");
    const modalArtistName = document.getElementById("modalArtistName");
    const modalTrackList = document.getElementById("modalTrackList");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    let allArtistsList = [];
    let allSongsList = [];

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    async function init() {
        try {
            if (typeof getAllSongs === "function") {
                allSongsList = await getAllSongs();
            } else if (typeof getSongsFromStorage === "function") {
                allSongsList = await getSongsFromStorage();
            } else {
                allSongsList = [];
            }
        } catch (err) {
            console.error("Failed to load artists data:", err);
            allSongsList = [];
        }

        processArtistsData();
        bindEvents();
    }

    // ==========================================================================
    // PROCESS ARTISTS DATA
    // ==========================================================================

    function processArtistsData() {
        const map = {};
        const overallMoodCounts = {};

        // 1. Load saved artist profiles (from Add Artist)
        let savedProfiles = [];
        if (typeof getAllArtistProfiles === "function") {
            savedProfiles = getAllArtistProfiles();
        }

        savedProfiles.forEach(function (profile) {
            const artistName = (profile.name || "").trim();
            if (!artistName) return;

            map[artistName] = {
                name: artistName,
                bio: profile.bio || "",
                image: profile.image || "",
                songs: [],
                moods: new Set(profile.mood ? [profile.mood] : []),
                totalEnergy: 0,
                totalTempo: 0
            };
            if (profile.mood) {
                overallMoodCounts[profile.mood] = (overallMoodCounts[profile.mood] || 0) + 1;
            }
        });

        // 2. Aggregate songs from storage
        allSongsList.forEach(function (song) {
            const rawArtist = (song.artist || "").trim();
            const artistName = rawArtist || "Unknown Artist";

            if (!map[artistName]) {
                map[artistName] = {
                    name: artistName,
                    bio: "",
                    image: "",
                    songs: [],
                    moods: new Set(),
                    totalEnergy: 0,
                    totalTempo: 0
                };
            }

            map[artistName].songs.push(song);
            if (song.mood) {
                map[artistName].moods.add(song.mood);
                overallMoodCounts[song.mood] = (overallMoodCounts[song.mood] || 0) + 1;
            }
            map[artistName].totalEnergy += (Number(song.energy) || 0);
            map[artistName].totalTempo += (Number(song.tempo) || 0);
        });

        allArtistsList = Object.values(map);

        // Sort: artists with songs first, then alphabetical
        allArtistsList.sort((a, b) => {
            if (b.songs.length !== a.songs.length) {
                return b.songs.length - a.songs.length;
            }
            return a.name.localeCompare(b.name);
        });

        // Update Stats
        if (totalArtistsEl) totalArtistsEl.textContent = allArtistsList.length;
        if (totalArtistTracksEl) totalArtistTracksEl.textContent = allSongsList.length;
        
        // Profiles with custom image
        const artworksCount = allArtistsList.filter(a => !!a.image).length;
        if (totalArtistArtworksEl) totalArtistArtworksEl.textContent = artworksCount;

        renderArtists(allArtistsList);
    }

    // ==========================================================================
    // RENDER ARTISTS
    // ==========================================================================

    function renderArtists(artists) {
        if (!artistGrid) return;
        artistGrid.innerHTML = "";

        if (artistCountBadge) {
            artistCountBadge.textContent = `${artists.length} Artist${artists.length === 1 ? "" : "s"}`;
        }

        if (artists.length === 0) {
            if (emptyArtists) emptyArtists.style.display = "flex";
            return;
        }

        if (emptyArtists) emptyArtists.style.display = "none";

        artists.forEach(function (artist) {
            const card = document.createElement("div");
            card.className = "artist-card";

            const initial = artist.name.charAt(0).toUpperCase() || "♪";
            const avatarContent = artist.image
                ? `<img src="${escapeHTML(artist.image)}" alt="${escapeHTML(artist.name)}" class="artist-avatar-img">`
                : initial;

            const moodTagsHTML = Array.from(artist.moods)
                .slice(0, 3)
                .map(m => `<span class="artist-mood-tag">${escapeHTML(m)}</span>`)
                .join("");

            card.innerHTML = `
                <div class="artist-avatar-wrap">
                    <div class="artist-avatar">${avatarContent}</div>
                    <span class="artist-badge-count">${artist.songs.length}</span>
                </div>
                <div class="artist-info">
                    <h3>${escapeHTML(artist.name)}</h3>
                    <p>${artist.songs.length} track${artist.songs.length === 1 ? "" : "s"} in catalog</p>
                </div>
                <div class="artist-moods">
                    ${moodTagsHTML || '<span class="artist-mood-tag">Acoustic</span>'}
                </div>
                <div class="artist-actions">
                    <button type="button" class="artist-play-btn" ${artist.songs.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ""}>
                        <span>▶</span> ${artist.songs.length === 0 ? "No Tracks" : "Play All"}
                    </button>
                    <button type="button" class="artist-view-btn" title="View tracklist" ${artist.songs.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ""}>
                        <span>♫</span> Tracks
                    </button>
                </div>
            `;

            // Play All button
            const playBtn = card.querySelector(".artist-play-btn");
            if (playBtn) {
                playBtn.addEventListener("click", function () {
                    playArtistDiscography(artist);
                });
            }

            // View Tracks button
            const viewBtn = card.querySelector(".artist-view-btn");
            if (viewBtn) {
                viewBtn.addEventListener("click", function () {
                    openArtistModal(artist);
                });
            }

            artistGrid.appendChild(card);
        });
    }

    // ==========================================================================
    // PLAY ARTIST DISCOGRAPHY
    // ==========================================================================

    function playArtistDiscography(artist) {
        if (!artist.songs || artist.songs.length === 0) {
            console.warn("⚠️ No tracks available for this artist:", artist.name);
            return;
        }

        console.log("▶ Playing artist discography:", artist.name, artist.songs);

        if (typeof setPlayerSongList === "function") {
            setPlayerSongList(artist.songs);
        }

        if (typeof playSong === "function") {
            playSong(artist.songs[0], artist.songs);
        } else {
            console.error("❌ playSong function not found on page");
        }
    }

    // ==========================================================================
    // ARTIST TRACKS MODAL
    // ==========================================================================

    function openArtistModal(artist) {
        if (!modalOverlay || !modalTrackList || !modalArtistName) return;

        modalArtistName.textContent = `${artist.name} (${artist.songs.length} Tracks)`;
        modalTrackList.innerHTML = "";

        artist.songs.forEach(function (song, idx) {
            const item = document.createElement("div");
            item.className = "artist-track-item";
            item.innerHTML = `
                <div class="artist-track-item-info">
                    <strong>${idx + 1}. ${escapeHTML(song.title || "Untitled")}</strong>
                    <span>${escapeHTML(song.mood || "Unknown")} • ⚡ ${song.energy || 0} • ${song.tempo || 0} BPM</span>
                </div>
                <button type="button" class="play-song" style="padding: 7px 14px; font-size: 11px;">
                    <span>▶</span> Play
                </button>
            `;

            const playTrackBtn = item.querySelector(".play-song");
            if (playTrackBtn) {
                playTrackBtn.addEventListener("click", function () {
                    console.log("▶ Playing artist track:", song.title);
                    if (typeof setPlayerSongList === "function") {
                        setPlayerSongList(artist.songs);
                    }
                    if (typeof playSong === "function") {
                        playSong(song, artist.songs);
                    }
                });
            }

            modalTrackList.appendChild(item);
        });

        modalOverlay.style.display = "flex";
    }

    function closeArtistModal() {
        if (modalOverlay) {
            modalOverlay.style.display = "none";
        }
    }

    // ==========================================================================
    // EVENTS
    // ==========================================================================

    function bindEvents() {
        // Instant search / filter
        if (artistSearch) {
            artistSearch.addEventListener("input", function (e) {
                const query = e.target.value.trim().toLowerCase();
                if (!query) {
                    renderArtists(allArtistsList);
                    return;
                }

                const filtered = allArtistsList.filter(function (artist) {
                    const nameMatch = artist.name.toLowerCase().includes(query);
                    const moodMatch = Array.from(artist.moods).some(m => m.toLowerCase().includes(query));
                    return nameMatch || moodMatch;
                });

                renderArtists(filtered);
            });
        }

        // Modal Close
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", closeArtistModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener("click", function (e) {
                if (e.target === modalOverlay) {
                    closeArtistModal();
                }
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeArtistModal();
            }
        });
    }

    // Escape utility
    function escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    init();
})();
