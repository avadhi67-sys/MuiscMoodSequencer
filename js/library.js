// ============================================
// SONICFLOW 2.0
<<<<<<< HEAD
// LIBRARY MODULE (3D COVER FLOW & GRID VIEW)
// ============================================

(function () {
    "use strict";

    console.log("📚 SonicFlow Library loading with 3D Cover Flow...");
=======
// LIBRARY MODULE
// ============================================

(function () {

    "use strict";


    console.log("📚 SonicFlow Library loading...");

>>>>>>> f488952eac721cff9e8db671353847099801d9b0

    // ========================================
    // DOM ELEMENTS
    // ========================================
<<<<<<< HEAD
    const songGrid = document.getElementById("songGrid");
    const emptyLibrary = document.getElementById("emptyLibrary");
    const totalSongs = document.getElementById("totalSongs");
    const totalMoods = document.getElementById("totalMoods");
    const averageEnergy = document.getElementById("averageEnergy");
    const songCountLabel = document.getElementById("songCountLabel");
    const librarySearch = document.getElementById("librarySearch");

    // 3D Coverflow Elements
    const coverflowContainer = document.getElementById("coverflowContainer");
    const coverflowTrack = document.getElementById("coverflowTrack");
    const coverflowStage = document.getElementById("coverflowStage");
    const coverflowGlow = document.getElementById("coverflowGlow");
    const coverflowPrev = document.getElementById("coverflowPrev");
    const coverflowNext = document.getElementById("coverflowNext");
    const coverflowActiveDock = document.getElementById("coverflowActiveDock");
    const dockMood = document.getElementById("dockMood");
    const dockEnergy = document.getElementById("dockEnergy");
    const dockTempo = document.getElementById("dockTempo");
    const dockPlayBtn = document.getElementById("dockPlayBtn");
    const dockDeleteBtn = document.getElementById("dockDeleteBtn");
    const coverflowPagination = document.getElementById("coverflowPagination");
    const viewModeCoverflow = document.getElementById("viewModeCoverflow");
    const viewModeGrid = document.getElementById("viewModeGrid");

    // ========================================
    // STATE
    // ========================================
    let currentLibrarySongs = [];
    let displayedSongs = [];
    let activeCoverflowIndex = 0;
    let currentViewMode = "coverflow"; // "coverflow" | "grid"

    // Mood Ambient Glow Palette Map
    const MOOD_GLOW_COLORS = {
        "happy": "radial-gradient(circle, rgba(184, 80, 50, 0.45) 0%, rgba(0,0,0,0) 70%)",
        "energetic": "radial-gradient(circle, rgba(252, 240, 214, 0.5) 0%, rgba(0,0,0,0) 70%)",
        "chill": "radial-gradient(circle, rgba(60, 90, 110, 0.45) 0%, rgba(0,0,0,0) 70%)",
        "calm": "radial-gradient(circle, rgba(70, 110, 95, 0.45) 0%, rgba(0,0,0,0) 70%)",
        "sad": "radial-gradient(circle, rgba(50, 45, 85, 0.5) 0%, rgba(0,0,0,0) 70%)",
        "melancholy": "radial-gradient(circle, rgba(65, 50, 80, 0.45) 0%, rgba(0,0,0,0) 70%)",
        "romantic": "radial-gradient(circle, rgba(252, 240, 214, 0.55) 0%, rgba(0,0,0,0) 70%)",
        "dark": "radial-gradient(circle, rgba(40, 40, 55, 0.5) 0%, rgba(0,0,0,0) 70%)",
        "default": "radial-gradient(circle, rgba(252, 240, 214, 0.42) 0%, rgba(0,0,0,0) 70%)"
    };
=======

    const songGrid =
        document.getElementById("songGrid");


    const emptyLibrary =
        document.getElementById("emptyLibrary");


    const totalSongs =
        document.getElementById("totalSongs");


    const totalMoods =
        document.getElementById("totalMoods");


    const averageEnergy =
        document.getElementById("averageEnergy");


    const songCountLabel =
        document.getElementById("songCountLabel");


    const librarySearch =
        document.getElementById("librarySearch");


    // ========================================
    // LIBRARY SONGS
    // ========================================

    let currentLibrarySongs = [];

>>>>>>> f488952eac721cff9e8db671353847099801d9b0

    // ========================================
    // LOAD LIBRARY
    // ========================================
<<<<<<< HEAD
    async function loadLibrary() {
        try {
            console.log("🔄 Loading songs from storage...");
            const songs = await getAllSongs();
            console.log("🎵 Songs received:", songs);

            currentLibrarySongs = songs || [];
            displayedSongs = [...currentLibrarySongs];

            if (typeof setPlayerSongList === "function") {
                setPlayerSongList(currentLibrarySongs);
            }

            displaySongs(currentLibrarySongs);
            updateStats(currentLibrarySongs);
        } catch (error) {
            console.error("❌ Error loading library:", error);
            currentLibrarySongs = [];
            displayedSongs = [];
            displaySongs([]);
            updateStats([]);
        }
    }

    // ========================================
    // DISPLAY SONGS (CONTROLLER)
    // ========================================
    function displaySongs(songs) {
        displayedSongs = songs || [];

        if (!displayedSongs || displayedSongs.length === 0) {
            if (coverflowContainer) coverflowContainer.style.display = "none";
            if (songGrid) songGrid.style.display = "none";
            if (emptyLibrary) emptyLibrary.style.display = "flex";
            if (songCountLabel) songCountLabel.textContent = "0 songs";
            return;
        }

        if (emptyLibrary) emptyLibrary.style.display = "none";

        if (songCountLabel) {
            songCountLabel.textContent = displayedSongs.length + (displayedSongs.length === 1 ? " track" : " tracks");
        }

        // Apply View Mode
        if (currentViewMode === "coverflow") {
            if (coverflowContainer) coverflowContainer.style.display = "flex";
            if (songGrid) songGrid.style.display = "none";
            renderCoverflow(displayedSongs);
        } else {
            if (coverflowContainer) coverflowContainer.style.display = "none";
            if (songGrid) songGrid.style.display = "grid";
            renderGrid(displayedSongs);
        }
    }

    // ========================================
    // 3D COVER FLOW RENDERING
    // ========================================
    function renderCoverflow(songs) {
        if (!coverflowTrack) return;
        coverflowTrack.innerHTML = "";
        if (coverflowPagination) coverflowPagination.innerHTML = "";

        if (activeCoverflowIndex >= songs.length) {
            activeCoverflowIndex = Math.max(0, songs.length - 1);
        }

        songs.forEach(function (song, index) {
            const card = createCoverflowCard(song, index);
            coverflowTrack.appendChild(card);

            // Pagination dot
            if (coverflowPagination) {
                const dot = document.createElement("div");
                dot.className = "coverflow-dot" + (index === activeCoverflowIndex ? " active" : "");
                dot.title = `${song.title || "Track"} - ${song.artist || "Artist"}`;
                dot.addEventListener("click", function () {
                    goToCoverflowIndex(index);
                });
                coverflowPagination.appendChild(dot);
            }
        });

        updateCoverflowPositions();
    }

    // ========================================
    // CREATE 3D COVER FLOW CARD
    // ========================================
    function createCoverflowCard(song, index) {
        const card = document.createElement("div");
        card.className = "coverflow-card";
        card.dataset.index = index;

        const coverImgUrl = typeof getSongCoverImage === "function" ? getSongCoverImage(song) : "";

        card.innerHTML = `
            <div class="coverflow-artwork">
                ${coverImgUrl 
                    ? `<img src="${escapeHTML(coverImgUrl)}" alt="${escapeHTML(song.title || 'Track')}" class="coverflow-artwork-img" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"><span class="coverflow-artwork-fallback" style="display:none;">♫</span>`
                    : `<span class="coverflow-artwork-fallback">♫</span>`
                }
                <div class="coverflow-play-overlay">
                    <div class="coverflow-play-btn-circle" title="Play Track">▶</div>
                </div>
            </div>
            <div class="coverflow-meta">
                <h3 class="coverflow-title">${escapeHTML(song.title || "Untitled")}</h3>
                <p class="coverflow-artist">${escapeHTML(song.artist || "Unknown Artist")}</p>
            </div>
        `;

        card.addEventListener("click", function () {
            if (index !== activeCoverflowIndex) {
                goToCoverflowIndex(index);
            } else {
                // If already active, clicking card plays song
                playLibrarySong(song);
            }
        });

        return card;
    }

    // ========================================
    // UPDATE COVER FLOW 3D POSITIONS
    // ========================================
    function updateCoverflowPositions() {
        const cards = coverflowTrack ? coverflowTrack.querySelectorAll(".coverflow-card") : [];
        if (!cards.length) return;

        const currentSong = displayedSongs[activeCoverflowIndex];

        cards.forEach(function (card, index) {
            const offset = index - activeCoverflowIndex;
            const absOffset = Math.abs(offset);

            if (offset === 0) {
                // Center active card
                card.classList.add("active");
                card.style.transform = `translateX(0px) translateZ(42px) rotateY(0deg) scale(1.05)`;
                card.style.opacity = "1";
                card.style.filter = "brightness(1)";
                card.style.zIndex = "30";
                card.style.pointerEvents = "auto";
            } else if (offset < 0) {
                // Left-side cards
                card.classList.remove("active");
                const tx = offset * 82 - 18;
                const tz = -Math.min(absOffset * 38, 150);
                const rotY = Math.min(31 + absOffset * 3, 50);
                const scale = Math.max(0.87 - absOffset * 0.06, 0.65);
                const opacity = absOffset <= 4 ? Math.max(1 - absOffset * 0.22, 0.15) : 0;
                const brightness = Math.max(0.78 - absOffset * 0.16, 0.3);

                card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
                card.style.opacity = String(opacity);
                card.style.filter = `brightness(${brightness})`;
                card.style.zIndex = String(30 - absOffset);
                card.style.pointerEvents = absOffset <= 3 ? "auto" : "none";
            } else {
                // Right-side cards
                card.classList.remove("active");
                const tx = offset * 82 + 18;
                const tz = -Math.min(absOffset * 38, 150);
                const rotY = -Math.min(31 + absOffset * 3, 50);
                const scale = Math.max(0.87 - absOffset * 0.06, 0.65);
                const opacity = absOffset <= 4 ? Math.max(1 - absOffset * 0.22, 0.15) : 0;
                const brightness = Math.max(0.78 - absOffset * 0.16, 0.3);

                card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`;
                card.style.opacity = String(opacity);
                card.style.filter = `brightness(${brightness})`;
                card.style.zIndex = String(30 - absOffset);
                card.style.pointerEvents = absOffset <= 3 ? "auto" : "none";
            }
        });

        // Update Dots
        if (coverflowPagination) {
            const dots = coverflowPagination.querySelectorAll(".coverflow-dot");
            dots.forEach(function (dot, index) {
                if (index === activeCoverflowIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }

        // Update Dock Info
        if (currentSong) {
            if (dockMood) dockMood.textContent = currentSong.mood || "Music";
            if (dockEnergy) dockEnergy.textContent = `⚡ ${currentSong.energy || 0}`;
            if (dockTempo) dockTempo.textContent = `${currentSong.tempo || 0} BPM`;

            // Ambient background glow
            if (coverflowGlow) {
                const moodKey = String(currentSong.mood || "").toLowerCase().trim();
                const glowBg = MOOD_GLOW_COLORS[moodKey] || MOOD_GLOW_COLORS.default;
                coverflowGlow.style.background = glowBg;
            }
        }
    }

    // ========================================
    // NAVIGATE COVER FLOW
    // ========================================
    function goToCoverflowIndex(index) {
        if (!displayedSongs.length) return;
        if (index < 0) index = 0;
        if (index >= displayedSongs.length) index = displayedSongs.length - 1;
        activeCoverflowIndex = index;
        updateCoverflowPositions();
    }

    function prevCoverflow() {
        if (activeCoverflowIndex > 0) {
            goToCoverflowIndex(activeCoverflowIndex - 1);
        } else {
            goToCoverflowIndex(displayedSongs.length - 1);
        }
    }

    function nextCoverflow() {
        if (activeCoverflowIndex < displayedSongs.length - 1) {
            goToCoverflowIndex(activeCoverflowIndex + 1);
        } else {
            goToCoverflowIndex(0);
        }
    }

    // Button Listeners
    if (coverflowPrev) {
        coverflowPrev.addEventListener("click", function (e) {
            e.preventDefault();
            prevCoverflow();
        });
    }

    if (coverflowNext) {
        coverflowNext.addEventListener("click", function (e) {
            e.preventDefault();
            nextCoverflow();
        });
    }

    // Dock Play Button
    if (dockPlayBtn) {
        dockPlayBtn.addEventListener("click", function () {
            if (displayedSongs[activeCoverflowIndex]) {
                playLibrarySong(displayedSongs[activeCoverflowIndex]);
            }
        });
    }

    // Dock Delete Button
    if (dockDeleteBtn) {
        dockDeleteBtn.addEventListener("click", async function () {
            const song = displayedSongs[activeCoverflowIndex];
            if (!song) return;

            const shouldDelete = confirm(`Delete "${song.title}" from your library?`);
            if (!shouldDelete) return;

            try {
                await deleteSong(song.id);
                console.log("🗑 Song deleted:", song.title);
                await loadLibrary();
            } catch (error) {
                console.error("❌ Delete error:", error);
                alert("Could not delete the song.");
            }
        });
    }

    // Keyboard Navigation
    document.addEventListener("keydown", function (e) {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
        if (currentViewMode !== "coverflow" || !displayedSongs.length) return;

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevCoverflow();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextCoverflow();
        } else if (e.key === "Enter" || e.key === " ") {
            if (document.activeElement.tagName !== "BUTTON") {
                e.preventDefault();
                if (displayedSongs[activeCoverflowIndex]) {
                    playLibrarySong(displayedSongs[activeCoverflowIndex]);
                }
            }
        }
    });

    // Touch Gestures on Mobile Stage (optional swipe)
    if (coverflowStage) {
        let touchStartX = 0;

        coverflowStage.addEventListener("touchstart", function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        coverflowStage.addEventListener("touchend", function (e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) nextCoverflow();
                else prevCoverflow();
            }
        }, { passive: true });
    }

    // ========================================
    // VIEW MODE TOGGLE (COVERFLOW VS GRID)
    // ========================================
    if (viewModeCoverflow && viewModeGrid) {
        viewModeCoverflow.addEventListener("click", function () {
            currentViewMode = "coverflow";
            viewModeCoverflow.classList.add("active");
            viewModeGrid.classList.remove("active");
            displaySongs(displayedSongs);
        });

        viewModeGrid.addEventListener("click", function () {
            currentViewMode = "grid";
            viewModeGrid.classList.add("active");
            viewModeCoverflow.classList.remove("active");
            displaySongs(displayedSongs);
        });
    }

    // ========================================
    // RENDER GRID (FALLBACK VIEW)
    // ========================================
    function renderGrid(songs) {
        if (!songGrid) return;
        songGrid.innerHTML = "";

        songs.forEach(function (song) {
            const card = createSongCard(song);
            songGrid.appendChild(card);
        });
    }

    function createSongCard(song) {
        const card = document.createElement("div");
        card.className = "song-card";
=======

    async function loadLibrary() {

        try {

            console.log(
                "🔄 Loading songs from storage..."
            );


            const songs =
                await getAllSongs();


            console.log(
                "🎵 Songs received:",
                songs
            );


            currentLibrarySongs =
                songs || [];


            // ==================================
            // SEND SONGS TO PLAYER
            // ==================================

            if (
                typeof setPlayerSongList ===
                "function"
            ) {

                setPlayerSongList(
                    currentLibrarySongs
                );

            }


            // ==================================
            // DISPLAY SONGS
            // ==================================

            displaySongs(
                currentLibrarySongs
            );


            // ==================================
            // UPDATE STATS
            // ==================================

            updateStats(
                currentLibrarySongs
            );


        }

        catch (error) {

            console.error(
                "❌ Error loading library:",
                error
            );


            currentLibrarySongs = [];


            displaySongs([]);


            updateStats([]);

        }

    }


    // ========================================
    // DISPLAY SONGS
    // ========================================

    function displaySongs(songs) {

        if (!songGrid) {

            console.error(
                "❌ songGrid not found"
            );

            return;

        }


        songGrid.innerHTML = "";


        // ==================================
        // EMPTY LIBRARY
        // ==================================

        if (
            !songs ||
            songs.length === 0
        ) {

            songGrid.style.display =
                "none";


            if (emptyLibrary) {

                emptyLibrary.style.display =
                    "flex";

            }


            if (songCountLabel) {

                songCountLabel.textContent =
                    "0 songs";

            }


            return;

        }


        // ==================================
        // SHOW SONG GRID
        // ==================================

        songGrid.style.display =
            "grid";


        if (emptyLibrary) {

            emptyLibrary.style.display =
                "none";

        }


        if (songCountLabel) {

            songCountLabel.textContent =
                songs.length +
                (
                    songs.length === 1
                        ? " song"
                        : " songs"
                );

        }


        // ==================================
        // CREATE CARDS
        // ==================================

        songs.forEach(
            function (song) {

                const card =
                    createSongCard(song);


                songGrid.appendChild(card);

            }
        );

    }


    // ========================================
    // CREATE SONG CARD
    // ========================================

    function createSongCard(song) {

        const card =
            document.createElement("div");


        card.className =
            "song-card";
>>>>>>> f488952eac721cff9e8db671353847099801d9b0

        const coverImgUrl = typeof getSongCoverImage === "function" ? getSongCoverImage(song) : "";

        card.innerHTML = `
<<<<<<< HEAD
=======

>>>>>>> f488952eac721cff9e8db671353847099801d9b0
            <div class="song-cover">
                ${coverImgUrl 
                    ? `<img src="${escapeHTML(coverImgUrl)}" alt="${escapeHTML(song.title || 'Track')}" class="song-cover-img" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"><span class="song-cover-fallback" style="display:none;">♫</span>`
                    : `<span>♫</span>`
                }
            </div>
<<<<<<< HEAD
            <div class="song-info">
                <h3>${escapeHTML(song.title || "Untitled")}</h3>
                <p>${escapeHTML(song.artist || "Unknown Artist")}</p>
            </div>
            <div class="song-details">
                <span>${escapeHTML(song.mood || "Unknown")}</span>
                <span>⚡ ${song.energy || 0}</span>
                <span>${song.tempo || 0} BPM</span>
            </div>
=======


            <div class="song-info">

                <h3>
                    ${escapeHTML(
                        song.title ||
                        "Untitled"
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        song.artist ||
                        "Unknown Artist"
                    )}
                </p>

            </div>


            <div class="song-details">

                <span>
                    ${escapeHTML(
                        song.mood ||
                        "Unknown"
                    )}
                </span>


                <span>
                    ⚡ ${song.energy || 0}
                </span>


                <span>
                    ${song.tempo || 0} BPM
                </span>

            </div>


>>>>>>> f488952eac721cff9e8db671353847099801d9b0
            <div class="song-actions">
                <button type="button" class="play-song">
                    <span>▶</span> Play
                </button>
<<<<<<< HEAD
                <button type="button" class="delete-song" title="Delete song" aria-label="Delete song">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `;

        const playButton = card.querySelector(".play-song");
        if (playButton) {
            playButton.addEventListener("click", function () {
                playLibrarySong(song);
            });
        }

        const deleteButton = card.querySelector(".delete-song");
        if (deleteButton) {
            deleteButton.addEventListener("click", async function () {
                const shouldDelete = confirm(`Delete "${song.title}"?`);
                if (!shouldDelete) return;

                try {
                    await deleteSong(song.id);
                    console.log("🗑 Song deleted:", song.title);
                    await loadLibrary();
                } catch (error) {
                    console.error("❌ Delete error:", error);
                    alert("Could not delete the song.");
                }
            });
        }

        return card;
    }

    // ========================================
    // PLAY LIBRARY SONG
    // ========================================
    function playLibrarySong(song) {
        console.log("▶ Playing library song:", song);

        if (typeof setPlayerSongList === "function") {
            setPlayerSongList(currentLibrarySongs);
        }

        if (typeof playSong === "function") {
            playSong(song, currentLibrarySongs);
        } else {
            console.error("❌ playSong() not found");
        }
    }

    // ========================================
    // UPDATE STATISTICS
    // ========================================
    function updateStats(songs) {
        if (!songs) songs = [];

        if (totalSongs) {
            totalSongs.textContent = songs.length;
        }

        const moods = new Set();
        songs.forEach(function (song) {
            if (song.mood) {
                moods.add(String(song.mood).toLowerCase());
            }
        });

        if (totalMoods) {
            totalMoods.textContent = moods.size;
        }

        if (songs.length === 0) {
            if (averageEnergy) averageEnergy.textContent = "0";
            return;
        }

        let totalEnergy = 0;
        songs.forEach(function (song) {
            totalEnergy += Number(song.energy) || 0;
        });

        const avgEnergy = totalEnergy / songs.length;
        if (averageEnergy) {
            averageEnergy.textContent = avgEnergy.toFixed(1);
        }
    }

    // ========================================
    // SEARCH
    // ========================================
    if (librarySearch) {
        librarySearch.addEventListener("input", function () {
            const query = librarySearch.value.toLowerCase().trim();

            if (query === "") {
                activeCoverflowIndex = 0;
                displaySongs(currentLibrarySongs);
                return;
            }

            const filteredSongs = currentLibrarySongs.filter(function (song) {
                const title = (song.title || "").toLowerCase();
                const artist = (song.artist || "").toLowerCase();
                const mood = (song.mood || "").toLowerCase();

                return title.includes(query) || artist.includes(query) || mood.includes(query);
            });

            activeCoverflowIndex = 0;
            displaySongs(filteredSongs);
        });
    }

    // ========================================
    // ESCAPE HTML
    // ========================================
    function escapeHTML(value) {
        const element = document.createElement("div");
        element.textContent = value;
        return element.innerHTML;
    }

    // ========================================
    // INITIALIZE
    // ========================================
    loadLibrary();

    console.log("✅ SonicFlow Library with 3D Cover Flow loaded successfully");
=======
                <button type="button" class="delete-song" title="Delete song">
                    ✕
                </button>
            </div>

        `;


        // ==================================
        // PLAY BUTTON
        // ==================================

        const playButton =
            card.querySelector(
                ".play-song"
            );


        if (playButton) {

            playButton.addEventListener(
                "click",
                function () {

                    playLibrarySong(song);

                }
            );

        }


        // ==================================
        // DELETE BUTTON
        // ==================================

        const deleteButton =
            card.querySelector(
                ".delete-song"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                async function () {

                    const shouldDelete =
                        confirm(
                            `Delete "${song.title}"?`
                        );


                    if (!shouldDelete) {

                        return;

                    }


                    try {

                        /*
                         * IMPORTANT:
                         * storage.js uses deleteSong()
                         */

                        await deleteSong(
                            song.id
                        );


                        console.log(
                            "🗑 Song deleted:",
                            song.title
                        );


                        await loadLibrary();

                    }

                    catch (error) {

                        console.error(
                            "❌ Delete error:",
                            error
                        );


                        alert(
                            "Could not delete the song."
                        );

                    }

                }
            );

        }


        return card;

    }


    // ========================================
    // PLAY LIBRARY SONG
    // ========================================

    function playLibrarySong(song) {

        console.log(
            "▶ Playing library song:",
            song
        );


        // Give complete list to player

        if (
            typeof setPlayerSongList ===
            "function"
        ) {

            setPlayerSongList(
                currentLibrarySongs
            );

        }


        // Play selected song

        if (
            typeof playSong ===
            "function"
        ) {

            playSong(
                song,
                currentLibrarySongs
            );

        }

        else {

            console.error(
                "❌ playSong() not found"
            );

        }

    }


    // ========================================
    // UPDATE STATISTICS
    // ========================================

    function updateStats(songs) {

        if (!songs) {

            songs = [];

        }


        // ==================================
        // TOTAL SONGS
        // ==================================

        if (totalSongs) {

            totalSongs.textContent =
                songs.length;

        }


        // ==================================
        // TOTAL MOODS
        // ==================================

        const moods =
            new Set();


        songs.forEach(
            function (song) {

                if (song.mood) {

                    moods.add(
                        String(song.mood)
                            .toLowerCase()
                    );

                }

            }
        );


        if (totalMoods) {

            totalMoods.textContent =
                moods.size;

        }


        // ==================================
        // AVERAGE ENERGY
        // ==================================

        if (songs.length === 0) {

            if (averageEnergy) {

                averageEnergy.textContent =
                    "0";

            }

            return;

        }


        let totalEnergy = 0;


        songs.forEach(
            function (song) {

                totalEnergy +=
                    Number(
                        song.energy
                    ) || 0;

            }
        );


        const avgEnergy =
            totalEnergy /
            songs.length;


        if (averageEnergy) {

            averageEnergy.textContent =
                avgEnergy.toFixed(1);

        }

    }


    // ========================================
    // SEARCH
    // ========================================

    if (librarySearch) {

        librarySearch.addEventListener(
            "input",
            function () {

                const query =
                    librarySearch.value
                        .toLowerCase()
                        .trim();


                if (query === "") {

                    displaySongs(
                        currentLibrarySongs
                    );

                    return;

                }


                const filteredSongs =
                    currentLibrarySongs.filter(
                        function (song) {

                            const title =
                                (
                                    song.title ||
                                    ""
                                )
                                .toLowerCase();


                            const artist =
                                (
                                    song.artist ||
                                    ""
                                )
                                .toLowerCase();


                            const mood =
                                (
                                    song.mood ||
                                    ""
                                )
                                .toLowerCase();


                            return (
                                title.includes(query) ||
                                artist.includes(query) ||
                                mood.includes(query)
                            );

                        }
                    );


                displaySongs(
                    filteredSongs
                );

            }
        );

    }


    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");


        element.textContent =
            value;


        return element.innerHTML;

    }


    // ========================================
    // INITIALIZE
    // ========================================

    loadLibrary();


    console.log(
        "✅ SonicFlow Library loaded successfully"
    );


>>>>>>> f488952eac721cff9e8db671353847099801d9b0
})();