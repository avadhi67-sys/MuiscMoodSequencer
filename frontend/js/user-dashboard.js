// ==========================================================================
// SONICFLOW USER DASHBOARD CONTROLLER
// Dedicated Listener Experience: Search, Mood Filtering & Playback
// ==========================================================================

(function () {
    "use strict";

    console.log("🎧 SonicFlow User Dashboard Controller Initialized");

    let allUserSongs = [];
    let displayedUserSongs = [];
    let activeMood = "all";

    document.addEventListener("DOMContentLoaded", async function () {
        // Enforce Authentication
        if (typeof requireAuth === "function") {
            if (!requireAuth()) return;
        }

        // Set personalized user name
        const user = typeof getStoredUser === "function" ? getStoredUser() : null;
        if (user && user.name) {
            const welcomeEl = document.getElementById("welcomeUserName");
            if (welcomeEl) welcomeEl.textContent = user.name;
        }

        bindSearchAndFilters();
        await loadUserTracks();
    });

    async function loadUserTracks() {
        try {
            const songs = await getSongsFromStorage();
            allUserSongs = songs || [];
            displayedUserSongs = [...allUserSongs];

            if (typeof setPlayerSongList === "function") {
                setPlayerSongList(allUserSongs);
            }

            const countEl = document.getElementById("countAllMoods");
            if (countEl) countEl.textContent = allUserSongs.length;

            renderUserGrid(displayedUserSongs);
        } catch (e) {
            console.error("Failed to load user tracks from MongoDB:", e);
            renderEmptyState("Error connecting to server. Please ensure Node.js is running.");
        }
    }

    function renderUserGrid(songs) {
        const grid = document.getElementById("userSongGrid");
        const countLabel = document.getElementById("userSongCountLabel");

        if (countLabel) {
            countLabel.textContent = `${songs.length} track${songs.length === 1 ? '' : 's'}`;
        }

        if (!grid) return;

        if (!songs || songs.length === 0) {
            renderEmptyState("No matching tracks found for this mood filter.");
            return;
        }

        grid.innerHTML = "";

        songs.forEach(song => {
            const card = document.createElement("div");
            card.className = "user-song-card";

            const coverUrl = (typeof getSongCoverImage === "function") 
                ? getSongCoverImage(song) 
                : (song.imageUrl || "/images/covers/cover-1.png");

            card.innerHTML = `
                <div class="user-card-cover-wrap">
                    <img src="${coverUrl}" alt="${escapeHtml(song.title)}" class="user-card-cover" onerror="this.src='/images/covers/cover-1.png'">
                    <div class="user-card-play-overlay">
                        <button type="button" class="card-play-btn" title="Play ${escapeHtml(song.title)}">
                            ▶
                        </button>
                    </div>
                </div>
                <h4 class="user-card-title">${escapeHtml(song.title)}</h4>
                <p class="user-card-artist">${escapeHtml(song.artist)}</p>
                <div class="user-card-meta">
                    <span class="card-mood-badge">${escapeHtml(song.mood || 'Calm')}</span>
                    <span>⚡ ${song.energy || 5}/10</span>
                    <span>${song.tempo || 120} BPM</span>
                </div>
            `;

            // Card Play Click
            card.querySelector(".card-play-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                if (typeof playSong === "function") {
                    playSong(song, displayedUserSongs);
                }
            });

            // Card click also plays
            card.addEventListener("click", () => {
                if (typeof playSong === "function") {
                    playSong(song, displayedUserSongs);
                }
            });

            grid.appendChild(card);
        });
    }

    function renderEmptyState(msg) {
        const grid = document.getElementById("userSongGrid");
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed var(--border);">
                <div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--text-dim);">♫</div>
                <h3 style="color: var(--text); margin-bottom: 6px;">No Tracks Available</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${msg}</p>
            </div>
        `;
    }

    function bindSearchAndFilters() {
        const searchInput = document.getElementById("userDashboardSearch");
        const moodPills = document.querySelectorAll(".mood-pill-btn");

        function filter() {
            const query = (searchInput ? searchInput.value : "").toLowerCase().trim();

            displayedUserSongs = allUserSongs.filter(song => {
                const matchQuery = !query ||
                    (song.title && song.title.toLowerCase().includes(query)) ||
                    (song.artist && song.artist.toLowerCase().includes(query)) ||
                    (song.mood && song.mood.toLowerCase().includes(query));

                const matchMood = activeMood === "all" ||
                    (song.mood && song.mood.toLowerCase() === activeMood.toLowerCase());

                return matchQuery && matchMood;
            });

            renderUserGrid(displayedUserSongs);
        }

        if (searchInput) {
            searchInput.addEventListener("input", filter);
        }

        moodPills.forEach(pill => {
            pill.addEventListener("click", () => {
                moodPills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                activeMood = pill.getAttribute("data-mood") || "all";
                filter();
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
