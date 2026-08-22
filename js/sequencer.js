// ============================================
// SONICFLOW 2.0
// MOOD SEQUENCER ENGINE
// ============================================

console.log("🎧 SonicFlow Mood Sequencer loading...");


// ============================================
// ELEMENTS
// ============================================

const songSelector =
    document.getElementById("songSelector");

const createFlowButton =
    document.getElementById("createFlowButton");

const smartShuffleButton =
    document.getElementById("smartShuffleButton");

const selectedSongBox =
    document.getElementById("selectedSong");

const generatedFlow =
    document.getElementById("generatedFlow");

const flowStatus =
    document.getElementById("flowStatus");


// ============================================
// SONG CACHE
// ============================================

let availableSongs = [];


// ============================================
// LOAD SONGS FROM STORAGE
// ============================================

async function loadSongsFromStorage() {

    try {

        console.log(
            "🔄 Sequencer loading songs..."
        );


        if (
            typeof getAllSongs !==
            "function"
        ) {

            console.error(
                "❌ getAllSongs() not found"
            );

            availableSongs = [];

            return;

        }


        availableSongs =
            await getAllSongs();


        if (!Array.isArray(availableSongs)) {

            availableSongs = [];

        }


        console.log(
            "🎵 Sequencer songs:",
            availableSongs
        );


    }

    catch (error) {

        console.error(
            "❌ Could not load songs:",
            error
        );

        availableSongs = [];

    }

}


// ============================================
// GET AVAILABLE SONGS
// ============================================

function getAvailableSongs() {

    return availableSongs;

}


// ============================================
// GET SONG BY ID
// ============================================

function findSongById(id) {

    const songs =
        getAvailableSongs();


    return songs.find(
        function(song) {

            return String(song.id) ===
                String(id);

        }
    );

}


// ============================================
// LOAD SONG OPTIONS
// ============================================

function loadSongOptions() {

    if (!songSelector) {

        console.error(
            "❌ songSelector not found"
        );

        return;

    }


    const songs =
        getAvailableSongs();


    songSelector.innerHTML = "";


    // ========================================
    // NO SONGS
    // ========================================

    if (
        !songs ||
        songs.length === 0
    ) {

        songSelector.innerHTML = `

            <option value="">
                No songs available
            </option>

        `;


        if (selectedSongBox) {

            selectedSongBox.innerHTML = `

                <div class="selected-cover">
                    ♪
                </div>

                <div>

                    <strong>
                        Choose a song
                    </strong>

                    <span>
                        Add songs to your library first
                    </span>

                </div>

            `;

        }


        return;

    }


    // ========================================
    // DEFAULT OPTION
    // ========================================

    const defaultOption =
        document.createElement("option");


    defaultOption.value = "";


    defaultOption.textContent =
        "Select a starting song";


    songSelector.appendChild(
        defaultOption
    );


    // ========================================
    // ADD SONGS
    // ========================================

    songs.forEach(
        function(song) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                song.id;


            option.textContent =
                `${song.title} — ${song.artist}`;


            songSelector.appendChild(
                option
            );

        }
    );


    console.log(
        `✅ ${songs.length} songs added to dropdown`
    );

}


// ============================================
// SHOW SELECTED SONG
// ============================================

function showSelectedSong() {

    if (!selectedSongBox) {

        return;

    }


    if (!songSelector) {

        return;

    }


    const songId =
        songSelector.value;


    // ========================================
    // NOTHING SELECTED
    // ========================================

    if (!songId) {

        selectedSongBox.innerHTML = `

            <div class="selected-cover">
                ♪
            </div>

            <div>

                <strong>
                    Choose a song
                </strong>

                <span>
                    This will be the starting
                    point of your flow
                </span>

            </div>

        `;


        return;

    }


    // ========================================
    // FIND SONG
    // ========================================

    const song =
        findSongById(songId);


    if (!song) {

        return;

    }


    // ========================================
    // SHOW SONG
    // ========================================

    selectedSongBox.innerHTML = `

        <div class="selected-cover">
            ♪
        </div>

        <div>

            <strong>
                ${escapeHTML(
                    song.title ||
                    "Untitled"
                )}
            </strong>

            <span>
                ${escapeHTML(
                    song.artist ||
                    "Unknown Artist"
                )}
                • ${song.tempo || 0} BPM
                • ${escapeHTML(
                    song.mood ||
                    "Unknown"
                )}
                • Energy ${song.energy || 0}
            </span>

        </div>

    `;

}


// ============================================
// MOOD GROUPS
// ============================================

const moodGroups = {

    calm: [
        "calm",
        "peaceful",
        "chill",
        "dreamy"
    ],

    romantic: [
        "romantic",
        "love"
    ],

    happy: [
        "happy",
        "upbeat",
        "joyful"
    ],

    energetic: [
        "energetic",
        "excited",
        "party",
        "powerful"
    ],

    sad: [
        "sad",
        "melancholic",
        "emotional"
    ],

    dark: [
        "dark",
        "intense"
    ]

};


// ============================================
// FIND MOOD GROUP
// ============================================

function getMoodGroup(mood) {

    const value =
        String(mood || "")
            .toLowerCase()
            .trim();


    for (
        const group in moodGroups
    ) {

        if (
            moodGroups[group].includes(
                value
            )
        ) {

            return group;

        }

    }


    return value;

}


// ============================================
// MOOD SCORE
// ============================================

function calculateMoodScore(
    currentSong,
    nextSong
) {

    const currentMood =
        getMoodGroup(
            currentSong.mood
        );


    const nextMood =
        getMoodGroup(
            nextSong.mood
        );


    // Same mood

    if (
        currentMood === nextMood
    ) {

        return 1;

    }


    const relatedPairs = [

        ["calm", "romantic"],

        ["romantic", "happy"],

        ["happy", "energetic"],

        ["sad", "romantic"],

        ["energetic", "happy"],

        ["dark", "energetic"]

    ];


    for (
        const pair of relatedPairs
    ) {

        if (
            pair.includes(currentMood) &&
            pair.includes(nextMood)
        ) {

            return 0.75;

        }

    }


    return 0.35;

}


// ============================================
// ENERGY SCORE
// ============================================

function calculateEnergyScore(
    currentSong,
    nextSong
) {

    const currentEnergy =
        Number(
            currentSong.energy
        );


    const nextEnergy =
        Number(
            nextSong.energy
        );


    const difference =
        Math.abs(
            currentEnergy -
            nextEnergy
        );


    if (difference === 0) {

        return 1;

    }


    if (difference === 1) {

        return 0.90;

    }


    if (difference === 2) {

        return 0.75;

    }


    if (difference === 3) {

        return 0.55;

    }


    if (difference === 4) {

        return 0.30;

    }


    return 0.10;

}


// ============================================
// TEMPO SCORE
// ============================================

function calculateTempoScore(
    currentSong,
    nextSong
) {

    const currentTempo =
        Number(
            currentSong.tempo
        );


    const nextTempo =
        Number(
            nextSong.tempo
        );


    const difference =
        Math.abs(
            currentTempo -
            nextTempo
        );


    return Math.max(
        0,
        1 - (
            difference / 100
        )
    );

}


// ============================================
// FINAL TRANSITION SCORE
// ============================================

function calculateTransitionScore(
    currentSong,
    nextSong
) {

    const moodScore =
        calculateMoodScore(
            currentSong,
            nextSong
        );


    const energyScore =
        calculateEnergyScore(
            currentSong,
            nextSong
        );


    const tempoScore =
        calculateTempoScore(
            currentSong,
            nextSong
        );


    // Mood 40%
    // Energy 40%
    // Tempo 20%

    return (
        (moodScore * 0.40) +
        (energyScore * 0.40) +
        (tempoScore * 0.20)
    );

}


// ============================================
// RANK SONGS
// ============================================

function rankSongs(
    currentSong,
    songs
) {

    const rankedSongs =
        songs.map(
            function(song) {

                const moodScore =
                    calculateMoodScore(
                        currentSong,
                        song
                    );


                const energyScore =
                    calculateEnergyScore(
                        currentSong,
                        song
                    );


                const tempoScore =
                    calculateTempoScore(
                        currentSong,
                        song
                    );


                const totalScore =
                    calculateTransitionScore(
                        currentSong,
                        song
                    );


                return {

                    song: song,

                    score: totalScore,

                    moodScore:
                        moodScore,

                    energyScore:
                        energyScore,

                    tempoScore:
                        tempoScore

                };

            }
        );


    rankedSongs.sort(
        function(a, b) {

            return b.score -
                a.score;

        }
    );


    return rankedSongs;

}


// ============================================
// CHOOSE NEXT SONG
// ============================================

function chooseNextSong(
    currentSong,
    songs
) {

    const ranked =
        rankSongs(
            currentSong,
            songs
        );


    if (
        ranked.length === 0
    ) {

        return null;

    }


    const topCount =
        Math.min(
            3,
            ranked.length
        );


    const topSongs =
        ranked.slice(
            0,
            topCount
        );


    const random =
        Math.random();


    if (
        random < 0.60
    ) {

        return topSongs[0];

    }


    if (
        random < 0.85 &&
        topSongs.length > 1
    ) {

        return topSongs[1];

    }


    return topSongs[
        Math.min(
            2,
            topSongs.length - 1
        )
    ];

}


// ============================================
// CREATE MOOD FLOW
// ============================================

function createMoodFlow(
    startingSong
) {

    const songs =
        getAvailableSongs();


    if (
        !startingSong ||
        songs.length === 0
    ) {

        return [];

    }


    const flow = [];


    // Starting song

    flow.push({

        song: startingSong,

        score: 1,

        moodScore: 1,

        energyScore: 1,

        tempoScore: 1

    });


    // Remove starting song

    let remainingSongs =
        songs.filter(
            function(song) {

                return String(song.id) !==
                    String(startingSong.id);

            }
        );


    let currentSong =
        startingSong;


    // Build flow

    while (
        remainingSongs.length > 0
    ) {

        const next =
            chooseNextSong(
                currentSong,
                remainingSongs
            );


        if (!next) {

            break;

        }


        flow.push({

            song: next.song,

            score: next.score,

            moodScore:
                next.moodScore,

            energyScore:
                next.energyScore,

            tempoScore:
                next.tempoScore

        });


        currentSong =
            next.song;


        remainingSongs =
            remainingSongs.filter(
                function(song) {

                    return String(song.id) !==
                        String(next.song.id);

                }
            );

    }


    return flow;

}


// ============================================
// RENDER FLOW
// ============================================

function renderFlow(flow) {

    if (!generatedFlow) {

        return;

    }


    if (
        flow.length === 0
    ) {

        generatedFlow.innerHTML = `

            <div class="empty-flow">

                <div class="empty-icon">
                    ♪
                </div>

                <h3>
                    No flow created
                </h3>

                <p>
                    Select a starting song
                    and create your
                    musical journey.
                </p>

            </div>

        `;


        return;

    }


    generatedFlow.innerHTML = "";


    flow.forEach(
        function(item, index) {

            const song =
                item.song;


            const score =
                Math.round(
                    item.score * 100
                );


            const flowItem =
                document.createElement(
                    "div"
                );


            flowItem.className =
                "flow-item";


            flowItem.style.animationDelay =
                `${index * 0.08}s`;


            // =================================
            // STARTING SONG
            // =================================

            if (index === 0) {

                flowItem.innerHTML = `

                    <div class="flow-number">
                        01
                    </div>


                    <div class="flow-cover">
                        ♪
                    </div>


                    <div class="flow-song-info">

                        <strong>
                            ${escapeHTML(
                                song.title
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                song.artist
                            )}
                        </span>

                    </div>


                    <div class="flow-meta">

                        <span>
                            ${song.tempo} BPM
                        </span>

                        <span>
                            ${escapeHTML(
                                song.mood
                            )}
                        </span>

                        <span>
                            Energy ${song.energy}
                        </span>

                    </div>


                    <div class="transition-score">

                        <strong>
                            START
                        </strong>

                        <span>
                            starting point
                        </span>

                    </div>

                `;

            }

            // =================================
            // FOLLOWING SONGS
            // =================================

            else {

                const moodPercent =
                    Math.round(
                        item.moodScore * 100
                    );


                const energyPercent =
                    Math.round(
                        item.energyScore * 100
                    );


                const tempoPercent =
                    Math.round(
                        item.tempoScore * 100
                    );


                flowItem.innerHTML = `

                    <div class="flow-number">
                        ${String(
                            index + 1
                        ).padStart(2, "0")}
                    </div>


                    <div class="flow-cover">
                        ♪
                    </div>


                    <div class="flow-song-info">

                        <strong>
                            ${escapeHTML(
                                song.title
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                song.artist
                            )}
                        </span>

                    </div>


                    <div class="flow-meta">

                        <span>
                            ${song.tempo} BPM
                        </span>

                        <span>
                            ${escapeHTML(
                                song.mood
                            )}
                        </span>

                        <span>
                            Energy ${song.energy}
                        </span>

                    </div>


                    <div class="transition-score">

                        <strong>
                            ${score}%
                        </strong>

                        <span>
                            Mood ${moodPercent}%
                            • Energy ${energyPercent}%
                            • BPM ${tempoPercent}%
                        </span>

                    </div>

                `;

            }


            generatedFlow.appendChild(
                flowItem
            );

        }
    );

}


// ============================================
// CREATE MY FLOW
// ============================================

if (createFlowButton) {

    createFlowButton.addEventListener(
        "click",
        function() {

            const songId =
                songSelector.value;


            if (!songId) {

                alert(
                    "Please select a starting song first."
                );

                return;

            }


            const startingSong =
                findSongById(
                    songId
                );


            if (!startingSong) {

                alert(
                    "Starting song not found."
                );

                return;

            }


            if (flowStatus) {

                flowStatus.textContent =
                    "Analyzing your music...";

            }


            createFlowButton.disabled =
                true;


            setTimeout(
                function() {

                    const flow =
                        createMoodFlow(
                            startingSong
                        );


                    renderFlow(
                        flow
                    );


                    if (flowStatus) {

                        flowStatus.textContent =
                            `${flow.length} songs • Flow ready`;

                    }


                    createFlowButton.disabled =
                        false;


                    console.log(
                        "🎧 Generated SonicFlow:",
                        flow
                    );

                },
                500
            );

        }
    );

}


// ============================================
// SMART SHUFFLE
// ============================================

if (smartShuffleButton) {

    smartShuffleButton.addEventListener(
        "click",
        function() {

            const songs =
                getAvailableSongs();


            if (
                songs.length === 0
            ) {

                alert(
                    "Add songs to your library first."
                );

                return;

            }


            let startingSong =
                null;


            // Selected song

            if (
                songSelector &&
                songSelector.value
            ) {

                startingSong =
                    findSongById(
                        songSelector.value
                    );

            }


            // Random song

            if (!startingSong) {

                const randomIndex =
                    Math.floor(
                        Math.random() *
                        songs.length
                    );


                startingSong =
                    songs[randomIndex];


                songSelector.value =
                    startingSong.id;

            }


            showSelectedSong();


            if (flowStatus) {

                flowStatus.textContent =
                    "Smart Shuffle is thinking...";

            }


            smartShuffleButton.disabled =
                true;


            setTimeout(
                function() {

                    const flow =
                        createMoodFlow(
                            startingSong
                        );


                    renderFlow(
                        flow
                    );


                    if (flowStatus) {

                        flowStatus.textContent =
                            `${flow.length} songs • Smart Flow ready`;

                    }


                    smartShuffleButton.disabled =
                        false;


                    console.log(
                        "🔀 Smart Shuffle Flow:",
                        flow
                    );

                },
                500
            );

        }
    );

}


// ============================================
// SONG SELECTION
// ============================================

if (songSelector) {

    songSelector.addEventListener(
        "change",
        showSelectedSong
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


// ============================================
// INITIALIZE
// ============================================

async function initializeSequencer() {

    await loadSongsFromStorage();

    loadSongOptions();

    showSelectedSong();


    console.log(
        "✦ SonicFlow mood engine ready"
    );

}


// Start

initializeSequencer();