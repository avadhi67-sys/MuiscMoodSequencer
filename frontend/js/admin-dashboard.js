// ==========================================================================
// SONICFLOW ADMIN DASHBOARD CONTROLLER
// Full CRUD Operations for Songs & Artists via Express + MongoDB
// ==========================================================================

(function () {
    "use strict";

    console.log("👑 SonicFlow Admin Dashboard Controller Initialized");

    let allAdminSongs = [];
    let allAdminArtists = [];
    let allAdminUsers = [];

    // ==========================================================================
    // INITIALIZATION & STATS
    // ==========================================================================

    document.addEventListener("DOMContentLoaded", async function () {
        // Enforce admin permission
        if (typeof requireAdmin === "function") {
            if (!requireAdmin()) return;
        }

        bindTabs();
        bindModals();
        bindSearchAndFilters();
        bindFormSubmissions();

        await Promise.all([
            loadAdminStats(),
            loadAdminSongs(),
            loadAdminArtists(),
            loadAdminUsers()
        ]);
    });

    async function loadAdminStats() {
        try {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            const apiBase = (typeof window !== "undefined" && window.API_BASE) ? window.API_BASE : "";
            const response = await fetch(`${apiBase}/api/stats`, {
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include"
            });
            if (!response.ok) return;

            const data = await response.json();
            const stats = data.stats || {};

            document.getElementById("statTotalSongs").textContent = stats.totalSongs || 0;
            document.getElementById("statTotalArtists").textContent = stats.totalArtists || 0;
            document.getElementById("statTotalUsers").textContent = stats.totalUsers || 0;
            document.getElementById("statUniqueMoods").textContent = stats.uniqueMoods || 0;
            document.getElementById("statAvgEnergy").textContent = stats.averageEnergy || 0;
        } catch (e) {
            console.error("Failed to load admin stats:", e);
        }
    }

    // ==========================================================================
    // TABS LOGIC
    // ==========================================================================

    function bindTabs() {
        const tabBtns = document.querySelectorAll(".admin-tab-btn");
        const tabPanes = document.querySelectorAll(".admin-tab-pane");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                tabBtns.forEach(b => b.classList.remove("active"));
                tabPanes.forEach(p => p.classList.remove("active"));

                btn.classList.add("active");
                const pane = document.getElementById(targetTab);
                if (pane) pane.classList.add("active");
            });
        });
    }

    // ==========================================================================
    // SONGS MANAGEMENT (CRUD)
    // ==========================================================================

    async function loadAdminSongs() {
        try {
            const songs = await getSongsFromStorage();
            allAdminSongs = songs || [];
            document.getElementById("songsTabCount").textContent = allAdminSongs.length;
            renderSongsTable(allAdminSongs);
        } catch (e) {
            console.error("Error loading admin songs:", e);
        }
    }

    function renderSongsTable(songs) {
        const tbody = document.getElementById("adminSongsTableBody");
        if (!tbody) return;

        if (!songs || songs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        No songs found matching your search.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = "";

        songs.forEach(song => {
            const tr = document.createElement("tr");

            const coverUrl = (typeof getSongCoverImage === "function") 
                ? getSongCoverImage(song) 
                : (song.imageUrl || "/images/covers/cover-1.png");

            const moodClass = `mood-${(song.mood || 'default').toLowerCase()}`;

            tr.innerHTML = `
                <td>
                    <div class="table-song-cell">
                        <img src="${coverUrl}" alt="Cover" class="table-cover-thumb" onerror="this.src='/images/covers/cover-1.png'">
                        <div class="table-song-meta">
                            <strong>${escapeHtml(song.title)}</strong>
                            <span>ID: ${song.id ? song.id.slice(-6) : '-'}</span>
                        </div>
                    </div>
                </td>
                <td><strong>${escapeHtml(song.artist)}</strong></td>
                <td><span class="table-badge ${moodClass}">${escapeHtml(song.mood)}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span>⚡ ${song.energy || 5}</span>
                        <div style="width: 50px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
                            <div style="width: ${(song.energy || 5) * 10}%; height: 100%; background: #e5a93c; border-radius: 2px;"></div>
                        </div>
                    </div>
                </td>
                <td>${song.tempo || 120} BPM</td>
                <td style="font-size: 0.76rem; color: var(--text-dim); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${escapeHtml(song.audioUrl || 'Local Audio')}
                </td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button type="button" class="action-icon-btn preview-play" title="Play / Preview Track">
                            <span>▶</span>
                        </button>
                        <button type="button" class="action-icon-btn edit edit-song" title="Edit Track">
                            <span>✏️</span>
                        </button>
                        <button type="button" class="action-icon-btn delete delete-song" title="Delete Track">
                            <span>🗑️</span>
                        </button>
                    </div>
                </td>
            `;

            // Bind Actions
            tr.querySelector(".preview-play").addEventListener("click", () => {
                if (typeof playSong === "function") {
                    playSong(song, songs);
                }
            });

            tr.querySelector(".edit-song").addEventListener("click", () => {
                openEditSongModal(song);
            });

            tr.querySelector(".delete-song").addEventListener("click", async () => {
                const ok = confirm(`Are you sure you want to delete "${song.title}" from MongoDB?`);
                if (!ok) return;

                try {
                    await deleteSong(song.id);
                    await Promise.all([loadAdminSongs(), loadAdminStats()]);
                } catch (err) {
                    alert("Failed to delete song: " + err.message);
                }
            });

            tbody.appendChild(tr);
        });
    }

    // ==========================================================================
    // ARTISTS MANAGEMENT (CRUD)
    // ==========================================================================

    async function loadAdminArtists() {
        try {
            const artists = await getAllArtistProfiles();
            allAdminArtists = artists || [];
            document.getElementById("artistsTabCount").textContent = allAdminArtists.length;
            renderArtistsTable(allAdminArtists);
        } catch (e) {
            console.error("Error loading admin artists:", e);
        }
    }

    function renderArtistsTable(artists) {
        const tbody = document.getElementById("adminArtistsTableBody");
        if (!tbody) return;

        if (!artists || artists.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        No artists found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = "";

        artists.forEach(artist => {
            const tr = document.createElement("tr");
            const avatarUrl = artist.image || "/images/covers/cover-1.png";

            tr.innerHTML = `
                <td>
                    <div class="table-song-cell">
                        <img src="${avatarUrl}" alt="${escapeHtml(artist.name)}" class="table-cover-thumb" style="border-radius: 50%;" onerror="this.src='/images/covers/cover-1.png'">
                        <div class="table-song-meta">
                            <strong>${escapeHtml(artist.name)}</strong>
                            <span>Registered Creator</span>
                        </div>
                    </div>
                </td>
                <td><span class="table-badge mood-chill">${escapeHtml(artist.mood || "Eclectic")}</span></td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted); font-size: 0.82rem;">
                    ${escapeHtml(artist.bio || "No biography provided.")}
                </td>
                <td><strong>${artist.songCount || 0}</strong> tracks</td>
                <td style="text-align: right;">
                    <div class="table-actions" style="justify-content: flex-end;">
                        <button type="button" class="action-icon-btn edit edit-artist" title="Edit Artist">
                            <span>✏️</span>
                        </button>
                        <button type="button" class="action-icon-btn delete delete-artist" title="Delete Artist">
                            <span>🗑️</span>
                        </button>
                    </div>
                </td>
            `;

            tr.querySelector(".edit-artist").addEventListener("click", () => {
                openEditArtistModal(artist);
            });

            tr.querySelector(".delete-artist").addEventListener("click", async () => {
                const ok = confirm(`Are you sure you want to delete artist "${artist.name}" from MongoDB?`);
                if (!ok) return;

                try {
                    await deleteArtistProfile(artist.id || artist.name);
                    await Promise.all([loadAdminArtists(), loadAdminStats()]);
                } catch (err) {
                    alert("Failed to delete artist: " + err.message);
                }
            });

            tbody.appendChild(tr);
        });
    }

    // ==========================================================================
    // USERS MANAGEMENT
    // ==========================================================================

    async function loadAdminUsers() {
        try {
            const token = sessionStorage.getItem("sonicflow_jwt") || localStorage.getItem("sonicflow_jwt");
            const apiBase = (typeof window !== "undefined" && window.API_BASE) ? window.API_BASE : "";
            const response = await fetch(`${apiBase}/api/auth/users`, {
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include"
            });
            if (!response.ok) return;

            const data = await response.json();
            allAdminUsers = data.users || [];
            document.getElementById("usersTabCount").textContent = allAdminUsers.length;
            renderUsersTable(allAdminUsers);
        } catch (e) {
            console.error("Error loading users:", e);
        }
    }

    function renderUsersTable(users) {
        const tbody = document.getElementById("adminUsersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        users.forEach(u => {
            const tr = document.createElement("tr");
            const firstLetter = (u.name || "U").charAt(0).toUpperCase();
            const isAdmin = u.role === "admin";
            const roleBadge = isAdmin
                ? `<span class="role-pill admin">👑 Admin</span>`
                : `<span class="role-pill user">🎧 Listener</span>`;
            const createdStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-";

            tr.innerHTML = `
                <td>
                    <div class="table-song-cell">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isAdmin ? '#e5a93c' : '#4da8da'}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff;">
                            ${firstLetter}
                        </div>
                        <div class="table-song-meta">
                            <strong>${escapeHtml(u.name)}</strong>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(u.email)}</td>
                <td>${roleBadge}</td>
                <td style="font-family: monospace; font-size: 0.78rem; color: var(--text-dim);">${u._id || u.id}</td>
                <td>${createdStr}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ==========================================================================
    // SEARCH & FILTER
    // ==========================================================================

    function bindSearchAndFilters() {
        const songSearch = document.getElementById("adminSongSearch");
        const moodFilter = document.getElementById("adminSongMoodFilter");

        function filterSongs() {
            const q = (songSearch.value || "").toLowerCase().trim();
            const mood = moodFilter.value;

            const filtered = allAdminSongs.filter(s => {
                const matchQuery = !q || 
                    (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.artist && s.artist.toLowerCase().includes(q)) ||
                    (s.mood && s.mood.toLowerCase().includes(q));

                const matchMood = mood === "all" || (s.mood && s.mood.toLowerCase() === mood.toLowerCase());

                return matchQuery && matchMood;
            });

            renderSongsTable(filtered);
        }

        if (songSearch) songSearch.addEventListener("input", filterSongs);
        if (moodFilter) moodFilter.addEventListener("change", filterSongs);

        const artistSearch = document.getElementById("adminArtistSearch");
        if (artistSearch) {
            artistSearch.addEventListener("input", () => {
                const q = artistSearch.value.toLowerCase().trim();
                const filtered = allAdminArtists.filter(a => 
                    !q || (a.name && a.name.toLowerCase().includes(q))
                );
                renderArtistsTable(filtered);
            });
        }
    }

    // ==========================================================================
    // MODALS BINDING
    // ==========================================================================

    function bindModals() {
        // Open buttons
        const openAddSongBtn = document.getElementById("openAddSongBtn");
        const tableAddSongBtn = document.getElementById("tableAddSongBtn");
        const openAddArtistBtn = document.getElementById("openAddArtistBtn");
        const tableAddArtistBtn = document.getElementById("tableAddArtistBtn");

        if (openAddSongBtn) openAddSongBtn.onclick = () => openModal("addSongModal");
        if (tableAddSongBtn) tableAddSongBtn.onclick = () => openModal("addSongModal");
        if (openAddArtistBtn) openAddArtistBtn.onclick = () => openModal("addArtistModal");
        if (tableAddArtistBtn) tableAddArtistBtn.onclick = () => openModal("addArtistModal");

        // Close buttons
        document.querySelectorAll("[data-close]").forEach(btn => {
            btn.onclick = () => {
                const modalId = btn.getAttribute("data-close");
                closeModal(modalId);
            };
        });

        // Close on overlay backdrop click
        document.querySelectorAll(".admin-modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove("active");
                }
            });
        });
    }

    function openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add("active");
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove("active");
    }

    // ==========================================================================
    // FORMS SUBMISSION (ADD & EDIT)
    // ==========================================================================

    function bindFormSubmissions() {
        // 1. Add Song
        const addSongForm = document.getElementById("addSongFormModal");
        if (addSongForm) {
            addSongForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = document.getElementById("modalSongMessage");
                msg.style.display = "block";
                msg.style.background = "rgba(255,255,255,0.08)";
                msg.textContent = "Uploading track and saving to MongoDB...";

                const title = document.getElementById("modalSongTitle").value.trim();
                const artist = document.getElementById("modalSongArtist").value.trim();
                const mood = document.getElementById("modalSongMood").value;
                const energy = document.getElementById("modalSongEnergy").value;
                const tempo = document.getElementById("modalSongTempo").value;
                const audioFile = document.getElementById("modalSongAudioFile").files[0];
                const coverFile = document.getElementById("modalSongCoverFile").files[0];

                const formData = new FormData();
                formData.append("title", title);
                formData.append("artist", artist);
                formData.append("mood", mood);
                formData.append("energy", energy);
                formData.append("tempo", tempo);

                if (audioFile) {
                    formData.append("audio", audioFile);
                } else {
                    // Fallback to existing sample audio if no new file is uploaded
                    formData.append("audioUrl", "/assets/audio/calm-romantic.mp3");
                }

                if (coverFile) {
                    formData.append("cover", coverFile);
                }

                try {
                    await saveSong(formData);
                    msg.style.background = "rgba(46, 204, 113, 0.2)";
                    msg.style.color = "#2ecc71";
                    msg.textContent = "✓ Track saved successfully to MongoDB!";

                    setTimeout(() => {
                        closeModal("addSongModal");
                        addSongForm.reset();
                        msg.style.display = "none";
                        loadAdminSongs();
                        loadAdminStats();
                        loadAdminArtists();
                    }, 800);
                } catch (err) {
                    msg.style.background = "rgba(231, 76, 60, 0.2)";
                    msg.style.color = "#e74c3c";
                    msg.textContent = err.message || "Failed to save song.";
                }
            });
        }

        // 2. Edit Song
        const editSongForm = document.getElementById("editSongFormModal");
        if (editSongForm) {
            editSongForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = document.getElementById("editSongId").value;
                const msg = document.getElementById("editSongMessage");
                msg.style.display = "block";
                msg.style.background = "rgba(255,255,255,0.08)";
                msg.textContent = "Updating track in MongoDB...";

                const formData = new FormData();
                formData.append("title", document.getElementById("editSongTitle").value.trim());
                formData.append("artist", document.getElementById("editSongArtist").value.trim());
                formData.append("mood", document.getElementById("editSongMood").value);
                formData.append("energy", document.getElementById("editSongEnergy").value);
                formData.append("tempo", document.getElementById("editSongTempo").value);

                const coverFile = document.getElementById("editSongCoverFile").files[0];
                if (coverFile) {
                    formData.append("cover", coverFile);
                }

                try {
                    await updateSong(id, formData);
                    msg.style.background = "rgba(46, 204, 113, 0.2)";
                    msg.style.color = "#2ecc71";
                    msg.textContent = "✓ Track updated successfully in MongoDB!";

                    setTimeout(() => {
                        closeModal("editSongModal");
                        msg.style.display = "none";
                        loadAdminSongs();
                        loadAdminStats();
                    }, 800);
                } catch (err) {
                    msg.style.background = "rgba(231, 76, 60, 0.2)";
                    msg.style.color = "#e74c3c";
                    msg.textContent = err.message || "Failed to update song.";
                }
            });
        }

        // 3. Add Artist
        const addArtistForm = document.getElementById("addArtistFormModal");
        if (addArtistForm) {
            addArtistForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const msg = document.getElementById("modalArtistMessage");
                msg.style.display = "block";
                msg.style.background = "rgba(255,255,255,0.08)";
                msg.textContent = "Registering artist in MongoDB...";

                const name = document.getElementById("modalArtistName").value.trim();
                const mood = document.getElementById("modalArtistMood").value.trim();
                const bio = document.getElementById("modalArtistBio").value.trim();
                const imageFile = document.getElementById("modalArtistImage").files[0];

                const formData = new FormData();
                formData.append("name", name);
                formData.append("mood", mood);
                formData.append("bio", bio);
                if (imageFile) formData.append("image", imageFile);

                try {
                    await saveArtistProfile(formData);
                    msg.style.background = "rgba(46, 204, 113, 0.2)";
                    msg.style.color = "#2ecc71";
                    msg.textContent = "✓ Artist profile created!";

                    setTimeout(() => {
                        closeModal("addArtistModal");
                        addArtistForm.reset();
                        msg.style.display = "none";
                        loadAdminArtists();
                        loadAdminStats();
                    }, 800);
                } catch (err) {
                    msg.style.background = "rgba(231, 76, 60, 0.2)";
                    msg.style.color = "#e74c3c";
                    msg.textContent = err.message || "Failed to create artist.";
                }
            });
        }

        // 4. Edit Artist
        const editArtistForm = document.getElementById("editArtistFormModal");
        if (editArtistForm) {
            editArtistForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = document.getElementById("editArtistId").value;
                const msg = document.getElementById("editArtistMessage");
                msg.style.display = "block";
                msg.style.background = "rgba(255,255,255,0.08)";
                msg.textContent = "Updating artist in MongoDB...";

                const formData = new FormData();
                formData.append("name", document.getElementById("editArtistName").value.trim());
                formData.append("mood", document.getElementById("editArtistMood").value.trim());
                formData.append("bio", document.getElementById("editArtistBio").value.trim());
                const imageFile = document.getElementById("editArtistImage").files[0];
                if (imageFile) formData.append("image", imageFile);

                try {
                    await updateArtistProfile(id, formData);
                    msg.style.background = "rgba(46, 204, 113, 0.2)";
                    msg.style.color = "#2ecc71";
                    msg.textContent = "✓ Artist updated successfully!";

                    setTimeout(() => {
                        closeModal("editArtistModal");
                        msg.style.display = "none";
                        loadAdminArtists();
                        loadAdminStats();
                    }, 800);
                } catch (err) {
                    msg.style.background = "rgba(231, 76, 60, 0.2)";
                    msg.style.color = "#e74c3c";
                    msg.textContent = err.message || "Failed to update artist.";
                }
            });
        }
    }

    function openEditSongModal(song) {
        document.getElementById("editSongId").value = song.id || song._id;
        document.getElementById("editSongTitle").value = song.title || "";
        document.getElementById("editSongArtist").value = song.artist || "";
        document.getElementById("editSongMood").value = song.mood || "Calm";
        document.getElementById("editSongEnergy").value = song.energy || 5;
        document.getElementById("editSongTempo").value = song.tempo || 120;
        document.getElementById("editSongMessage").style.display = "none";
        openModal("editSongModal");
    }

    function openEditArtistModal(artist) {
        document.getElementById("editArtistId").value = artist.id || artist._id;
        document.getElementById("editArtistName").value = artist.name || "";
        document.getElementById("editArtistMood").value = artist.mood || "";
        document.getElementById("editArtistBio").value = artist.bio || "";
        document.getElementById("editArtistMessage").style.display = "none";
        openModal("editArtistModal");
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
