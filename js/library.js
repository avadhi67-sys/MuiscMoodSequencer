// ============================================
// SONICFLOW 2.0
// LIBRARY MODULE
// ============================================

(function () {

    "use strict";


    console.log("📚 SonicFlow Library loading...");


    // ========================================
    // DOM ELEMENTS
    // ========================================

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


    // ========================================
    // LOAD LIBRARY
    // ========================================

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


        card.innerHTML = `

            <div class="song-cover">

                <span>♫</span>

            </div>


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


            <div class="song-actions">
                <button type="button" class="play-song">
                    <span>▶</span> Play
                </button>
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


})();