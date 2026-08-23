// ==========================================================================
// SONICFLOW SEARCH CONTROLLER
// Instant Search & Mood Pill Filtering
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const mainSearchInput = document.getElementById("mainSearchInput");
    const topbarSearch = document.getElementById("topbarSearch");
    const clearSearchBtn = document.getElementById("clearSearch");
    const moodPills = document.querySelectorAll("#moodFilterPills .pill");
    const searchGrid = document.getElementById("searchSongGrid");
    const emptyState = document.getElementById("emptySearchResults");
    const resultCount = document.getElementById("resultCount");
    const resultsHeading = document.getElementById("resultsHeading");

    let allSongs = [];
    let currentMood = "all";
    let currentQuery = "";

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================

    async function init() {
        // Read URL query parameter if navigated from topbar on another page
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get("q");
        if (queryParam) {
            currentQuery = queryParam.trim().toLowerCase();
            if (mainSearchInput) mainSearchInput.value = queryParam;
            if (topbarSearch) topbarSearch.value = queryParam;
            if (clearSearchBtn) clearSearchBtn.style.display = "flex";
        }

        await loadAllSongs();
        bindEvents();
    }

    async function loadAllSongs() {
        try {
            if (typeof getAllSongs === "function") {
                allSongs = await getAllSongs();
            } else if (typeof getSongsFromStorage === "function") {
                allSongs = await getSongsFromStorage();
            } else {
                allSongs = [];
            }
        } catch (err) {
            console.error("Failed to load songs for search:", err);
            allSongs = [];
        }

        filterAndRender();
    }

    // ==========================================================================
    // EVENTS
    // ==========================================================================

    function bindEvents() {
        if (mainSearchInput) {
            mainSearchInput.addEventListener("input", function (e) {
                currentQuery = e.target.value.trim().toLowerCase();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = currentQuery ? "flex" : "none";
                }
                filterAndRender();
            });
        }

        if (topbarSearch) {
            topbarSearch.addEventListener("input", function (e) {
                if (mainSearchInput) {
                    mainSearchInput.value = e.target.value;
                }
                currentQuery = e.target.value.trim().toLowerCase();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = currentQuery ? "flex" : "none";
                }
                filterAndRender();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", function () {
                if (mainSearchInput) mainSearchInput.value = "";
                if (topbarSearch) topbarSearch.value = "";
                currentQuery = "";
                clearSearchBtn.style.display = "none";
                filterAndRender();
                if (mainSearchInput) mainSearchInput.focus();
            });
        }

        moodPills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                moodPills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                currentMood = pill.getAttribute("data-mood") || "all";
                filterAndRender();
            });
        });
    }

    // ==========================================================================
    // FILTER & RENDER
    // ==========================================================================

    function filterAndRender() {
        let filtered = allSongs.filter(function (song) {
            // Mood filter
            if (currentMood !== "all" && (song.mood || "").toLowerCase() !== currentMood.toLowerCase()) {
                return false;
            }

            // Text Query filter
            if (currentQuery) {
                const titleMatch = (song.title || "").toLowerCase().includes(currentQuery);
                const artistMatch = (song.artist || "").toLowerCase().includes(currentQuery);
                const moodMatch = (song.mood || "").toLowerCase().includes(currentQuery);
                const bpmMatch = String(song.tempo || "").includes(currentQuery);
                if (!titleMatch && !artistMatch && !moodMatch && !bpmMatch) {
                    return false;
                }
            }

            return true;
        });

        // Update heading & count
        if (resultCount) {
            resultCount.textContent = `${filtered.length} track${filtered.length === 1 ? "" : "s"}`;
        }

        if (resultsHeading) {
            if (currentMood !== "all" && currentQuery) {
                resultsHeading.textContent = `"${currentQuery}" in ${currentMood}`;
            } else if (currentMood !== "all") {
                resultsHeading.textContent = `${currentMood} Tracks`;
            } else if (currentQuery) {
                resultsHeading.textContent = `Results for "${currentQuery}"`;
            } else {
                resultsHeading.textContent = "All Tracks";
            }
        }

        // Render Cards
        if (!searchGrid) return;
        searchGrid.innerHTML = "";

        if (filtered.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        filtered.forEach(function (song) {
            const card = document.createElement("div");
            card.className = "song-card";
            card.innerHTML = `
                <div class="song-cover">
                    <span>♫</span>
                </div>
                <div class="song-info">
                    <h3>${escapeHTML(song.title || "Untitled")}</h3>
                    <p>${escapeHTML(song.artist || "Unknown Artist")}</p>
                </div>
                <div class="song-details">
                    <span>${escapeHTML(song.mood || "Unknown")}</span>
                    <span>⚡ ${song.energy || 0}</span>
                    <span>${song.tempo || 0} BPM</span>
                </div>
                <div class="song-actions">
                    <button type="button" class="play-song">
                        <span>▶</span> Play
                    </button>
                </div>
            `;

            const playBtn = card.querySelector(".play-song");
            if (playBtn) {
                playBtn.addEventListener("click", function () {
                    if (typeof setPlayerSongList === "function") {
                        setPlayerSongList(filtered);
                    }
                    if (typeof playSong === "function") {
                        playSong(song, filtered);
                    }
                });
            }

            searchGrid.appendChild(card);
        });
    }

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
});
