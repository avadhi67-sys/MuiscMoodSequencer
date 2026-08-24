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

    const songCoverUrl = typeof getSongCoverImage === "function" ? getSongCoverImage(song) : "";

    selectedSongBox.innerHTML = `

        <div class="selected-cover">
            ${songCoverUrl 
                ? `<img src="${escapeHTML(songCoverUrl)}" alt="Cover" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
                : `♪`
            }
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

let latestFlowData = [];

function renderFlow(flow) {
    latestFlowData = flow || [];
    const playFlowHeaderBtn = document.getElementById("playFlowHeaderBtn");

    if (!generatedFlow) {
        return;
    }

    if (flow.length === 0) {
        if (playFlowHeaderBtn) playFlowHeaderBtn.style.display = "none";
        generatedFlow.innerHTML = `
            <div class="empty-flow">
                <div class="empty-icon">♪</div>
                <h3>No flow created</h3>
                <p>Select a starting song and create your musical journey.</p>
            </div>
        `;
        return;
    }

    if (playFlowHeaderBtn) playFlowHeaderBtn.style.display = "inline-flex";
    generatedFlow.innerHTML = "";

    const flowSongList = flow.map(item => item.song);

    flow.forEach(function(item, index) {
        const song = item.song;
        const score = Math.round(item.score * 100);
        const flowItem = document.createElement("div");
        flowItem.className = "flow-item";
        flowItem.setAttribute("data-song-id", song.id);
        flowItem.style.animationDelay = `${index * 0.08}s`;

        const songCoverUrl = typeof getSongCoverImage === "function" ? getSongCoverImage(song) : "";
        const coverSnippet = songCoverUrl
            ? `<img src="${escapeHTML(songCoverUrl)}" alt="Cover" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
            : `♪`;

        if (index === 0) {
            flowItem.innerHTML = `
                <div class="flow-number">01</div>
                <div class="flow-cover">${coverSnippet}</div>
                <div class="flow-song-info">
                    <strong>${escapeHTML(song.title)}</strong>
                    <span>${escapeHTML(song.artist)}</span>
                </div>
                <div class="flow-meta">
                    <span>${song.tempo} BPM</span>
                    <span>${escapeHTML(song.mood)}</span>
                    <span>Energy ${song.energy}</span>
                </div>
                <div class="transition-score">
                    <strong>START</strong>
                    <span>starting point</span>
                </div>
                <button type="button" class="flow-item-play-btn" title="Play track">▶</button>
            `;
        } else {
            const moodPercent = Math.round(item.moodScore * 100);
            const energyPercent = Math.round(item.energyScore * 100);
            const tempoPercent = Math.round(item.tempoScore * 100);

            flowItem.innerHTML = `
                <div class="flow-number">${String(index + 1).padStart(2, "0")}</div>
                <div class="flow-cover">${coverSnippet}</div>
                <div class="flow-song-info">
                    <strong>${escapeHTML(song.title)}</strong>
                    <span>${escapeHTML(song.artist)}</span>
                </div>
                <div class="flow-meta">
                    <span>${song.tempo} BPM</span>
                    <span>${escapeHTML(song.mood)}</span>
                    <span>Energy ${song.energy}</span>
                </div>
                <div class="transition-score">
                    <strong>${score}%</strong>
                    <span>Mood ${moodPercent}% • Energy ${energyPercent}% • BPM ${tempoPercent}%</span>
                </div>
                <button type="button" class="flow-item-play-btn" title="Play track">▶</button>
            `;
        }

        // On clicking flowItem or play button
        flowItem.addEventListener("click", function () {
            if (typeof playSong === "function") {
                playSong(song, flowSongList);
                updateActiveFlowItem(song.id);
            }
        });

        generatedFlow.appendChild(flowItem);
    });
}

function updateActiveFlowItem(songId) {
    const items = document.querySelectorAll(".flow-item");
    items.forEach(el => {
        if (String(el.getAttribute("data-song-id")) === String(songId)) {
            el.classList.add("active-playing");
            const btn = el.querySelector(".flow-item-play-btn");
            if (btn) btn.textContent = "❚❚";
        } else {
            el.classList.remove("active-playing");
            const btn = el.querySelector(".flow-item-play-btn");
            if (btn) btn.textContent = "▶";
        }
    });
}

// ============================================
// PLAY FLOW CONTROLLER
// ============================================

const playFlowButton = document.getElementById("playFlowButton");
const playFlowHeaderBtn = document.getElementById("playFlowHeaderBtn");

function startPlayingActiveFlow() {
    if (latestFlowData && latestFlowData.length > 0) {
        const flowSongs = latestFlowData.map(f => f.song);
        if (typeof playSong === "function") {
            playSong(flowSongs[0], flowSongs);
            updateActiveFlowItem(flowSongs[0].id);
        }
        return;
    }

    // If flow not generated yet, try generating from selection or first available song
    const songId = songSelector ? songSelector.value : null;
    let startingSong = songId ? findSongById(songId) : null;
    const songs = getAvailableSongs();

    if (!startingSong && songs.length > 0) {
        startingSong = songs[0];
        if (songSelector) songSelector.value = startingSong.id;
        showSelectedSong();
    }

    if (!startingSong) {
        alert("Please add songs to your library first.");
        return;
    }

    const flow = createMoodFlow(startingSong);
    renderFlow(flow);
    if (flowStatus) {
        flowStatus.textContent = `${flow.length} songs • Playing flow`;
    }

    const flowSongs = flow.map(f => f.song);
    if (typeof playSong === "function") {
        playSong(flowSongs[0], flowSongs);
        updateActiveFlowItem(flowSongs[0].id);
    }
}

if (playFlowButton) {
    playFlowButton.addEventListener("click", startPlayingActiveFlow);
}

if (playFlowHeaderBtn) {
    playFlowHeaderBtn.addEventListener("click", startPlayingActiveFlow);
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
// MOOD ANALYSIS GRAPH CONTROLLER
// ============================================

const openMoodGraphButton = document.getElementById("openMoodGraphButton");
const viewGraphHeaderBtn = document.getElementById("viewGraphHeaderBtn");
const moodGraphModalOverlay = document.getElementById("moodGraphModalOverlay");
const moodGraphCloseBtn = document.getElementById("moodGraphCloseBtn");
const graphMetricTracks = document.getElementById("graphMetricTracks");
const graphMetricEnergy = document.getElementById("graphMetricEnergy");
const graphMetricBPM = document.getElementById("graphMetricBPM");
const graphMetricMatch = document.getElementById("graphMetricMatch");
const graphSvgContainer = document.getElementById("graphSvgContainer");
const moodDistributionList = document.getElementById("moodDistributionList");
const graphMoodSubtitle = document.getElementById("graphMoodSubtitle");

function openMoodGraph() {
    if (!moodGraphModalOverlay) return;

    // Use current flow if generated, otherwise available songs
    const isFlowActive = latestFlowData && latestFlowData.length > 0;
    const songList = isFlowActive
        ? latestFlowData.map(item => item.song)
        : (availableSongs || []);

    if (graphMoodSubtitle) {
        graphMoodSubtitle.textContent = isFlowActive ? "Across active sequenced flow" : "Across full music catalog";
    }

    if (songList.length === 0) {
        alert("Add songs to your library or generate a mood flow to view the analysis graph.");
        return;
    }

    // 1. Calculate Metrics
    let totalEnergy = 0;
    let totalBPM = 0;
    const moodCounts = {};

    songList.forEach(s => {
        totalEnergy += Number(s.energy) || 5;
        totalBPM += Number(s.tempo) || 120;
        const moodName = s.mood || "Unknown";
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
    });

    const avgEnergy = (totalEnergy / songList.length).toFixed(1);
    const avgBPM = Math.round(totalBPM / songList.length);

    let avgMatchScore = 96;
    if (isFlowActive) {
        let totalScore = 0;
        latestFlowData.forEach(item => {
            totalScore += (Number(item.score) || 0.9);
        });
        avgMatchScore = Math.round((totalScore / latestFlowData.length) * 100);
    }

    if (graphMetricTracks) graphMetricTracks.textContent = songList.length;
    if (graphMetricEnergy) graphMetricEnergy.textContent = `${avgEnergy} / 10`;
    if (graphMetricBPM) graphMetricBPM.textContent = `${avgBPM} BPM`;
    if (graphMetricMatch) graphMetricMatch.textContent = `${avgMatchScore}%`;

    // 2. Render SVG Acoustic Trajectory Curve
    renderAcousticTrajectoryGraph(songList);

    // 3. Render Mood Distribution Breakdown
    renderMoodDistribution(moodCounts, songList.length);

    moodGraphModalOverlay.style.display = "flex";
}

function closeMoodGraph() {
    if (moodGraphModalOverlay) {
        moodGraphModalOverlay.style.display = "none";
    }
}

function renderAcousticTrajectoryGraph(songList) {
    if (!graphSvgContainer) return;

    const width = graphSvgContainer.clientWidth || 720;
    const height = 220;
    const paddingLeft = 55;
    const paddingRight = 40;
    const paddingTop = 25;
    const paddingBottom = 35;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const pointsCount = songList.length;
    const stepX = pointsCount > 1 ? plotWidth / (pointsCount - 1) : plotWidth / 2;

    let minBPM = Infinity;
    let maxBPM = -Infinity;
    songList.forEach(s => {
        const bpm = Number(s.tempo) || 120;
        if (bpm < minBPM) minBPM = bpm;
        if (bpm > maxBPM) maxBPM = bpm;
    });
    if (minBPM === maxBPM) {
        minBPM = Math.max(40, minBPM - 20);
        maxBPM = maxBPM + 20;
    }

    const energyPoints = [];
    const tempoPoints = [];

    songList.forEach((song, i) => {
        const x = paddingLeft + (pointsCount > 1 ? i * stepX : plotWidth / 2);

        // Energy Y (1 at bottom, 10 at top)
        const energyVal = Math.max(1, Math.min(10, Number(song.energy) || 5));
        const energyY = paddingTop + plotHeight - ((energyVal - 1) / 9) * plotHeight;
        energyPoints.push({ x, y: energyY, val: energyVal, song });

        // Tempo Y
        const tempoVal = Number(song.tempo) || 120;
        const tempoRatio = Math.max(0, Math.min(1, (tempoVal - minBPM) / (maxBPM - minBPM || 1)));
        const tempoY = paddingTop + plotHeight - (tempoRatio * plotHeight);
        tempoPoints.push({ x, y: tempoY, val: tempoVal, song });
    });

    const energyPathD = energyPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    const tempoPathD = tempoPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

    const gridY1 = paddingTop;
    const gridY2 = paddingTop + plotHeight / 2;
    const gridY3 = paddingTop + plotHeight;

    let svgHTML = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: 100%;">
            <!-- Grid Lines -->
            <line x1="${paddingLeft}" y1="${gridY1}" x2="${width - paddingRight}" y2="${gridY1}" stroke="var(--border)" stroke-dasharray="3,3" stroke-width="1" />
            <line x1="${paddingLeft}" y1="${gridY2}" x2="${width - paddingRight}" y2="${gridY2}" stroke="var(--border)" stroke-dasharray="3,3" stroke-width="1" />
            <line x1="${paddingLeft}" y1="${gridY3}" x2="${width - paddingRight}" y2="${gridY3}" stroke="var(--border)" stroke-dasharray="3,3" stroke-width="1" />

            <!-- Y Axis Labels -->
            <text x="${paddingLeft - 8}" y="${gridY1 + 4}" font-size="10" font-weight="700" fill="var(--text-dim)" text-anchor="end">10 (Peak)</text>
            <text x="${paddingLeft - 8}" y="${gridY2 + 4}" font-size="10" font-weight="700" fill="var(--text-dim)" text-anchor="end">5</text>
            <text x="${paddingLeft - 8}" y="${gridY3 + 4}" font-size="10" font-weight="700" fill="var(--text-dim)" text-anchor="end">1 (Chill)</text>

            <!-- Tempo Path -->
            <path d="${tempoPathD}" fill="none" stroke="#BFBFDB" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />

            <!-- Energy Path -->
            <path d="${energyPathD}" fill="none" stroke="#AD525E" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />

            <!-- Data Nodes & Tooltips -->
            ${tempoPoints.map(p => `
                <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#BFBFDB" stroke="var(--bg-surface)" stroke-width="1.5" style="cursor: pointer;">
                    <title>${escapeHTML(p.song.title)} • ${p.val} BPM</title>
                </circle>
            `).join("")}

            ${energyPoints.map((p, idx) => `
                <g style="cursor: pointer;">
                    <circle cx="${p.x}" cy="${p.y}" r="6" fill="#AD525E" stroke="var(--bg-surface)" stroke-width="2" />
                    <text x="${p.x}" y="${height - 10}" font-size="10" font-weight="800" fill="var(--text-dim)" text-anchor="middle">#${idx + 1}</text>
                    <title>${escapeHTML(p.song.title)} (${escapeHTML(p.song.artist || 'Unknown')})&#10;Mood: ${p.song.mood || 'N/A'}&#10;Energy: ${p.val}/10&#10;Tempo: ${p.song.tempo || 0} BPM</title>
                </g>
            `).join("")}
        </svg>
    `;

    graphSvgContainer.innerHTML = svgHTML;
}

function renderMoodDistribution(moodCounts, total) {
    if (!moodDistributionList) return;
    moodDistributionList.innerHTML = "";

    const entries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    entries.forEach(([mood, count]) => {
        const pct = Math.round((count / total) * 100);
        const row = document.createElement("div");
        row.className = "mood-dist-row";
        row.innerHTML = `
            <div class="mood-dist-label">${escapeHTML(mood)}</div>
            <div class="mood-dist-bar-track">
                <div class="mood-dist-bar-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="mood-dist-count">${pct}%</div>
        `;
        moodDistributionList.appendChild(row);
    });
}

// Bind graph modal open/close events
if (openMoodGraphButton) {
    openMoodGraphButton.addEventListener("click", openMoodGraph);
}

if (viewGraphHeaderBtn) {
    viewGraphHeaderBtn.addEventListener("click", openMoodGraph);
}

if (moodGraphCloseBtn) {
    moodGraphCloseBtn.addEventListener("click", closeMoodGraph);
}

if (moodGraphModalOverlay) {
    moodGraphModalOverlay.addEventListener("click", function(e) {
        if (e.target === moodGraphModalOverlay) {
            closeMoodGraph();
        }
    });
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeMoodGraph();
    }
});

// ============================================
// INITIALIZE
// ============================================

async function initializeSequencer() {

    await loadSongsFromStorage();

    loadSongOptions();

    // Check for URL parameters from Home Page / Quick Launch
    const urlParams = new URLSearchParams(window.location.search);
    const startId = urlParams.get("startId");
    const targetMood = urlParams.get("mood");

    if (startId && songSelector) {
        const found = availableSongs.find(s => String(s.id) === String(startId));
        if (found) {
            songSelector.value = String(found.id);
        }
    } else if (targetMood && songSelector) {
        const foundMood = availableSongs.find(s => (s.mood || "").toLowerCase() === targetMood.toLowerCase());
        if (foundMood) {
            songSelector.value = String(foundMood.id);
        }
    }

    showSelectedSong();

    // If param was provided and song found, auto create flow
    if ((startId || targetMood) && songSelector && songSelector.value) {
        setTimeout(() => {
            if (typeof createHarmonicFlow === "function") {
                createHarmonicFlow();
            }
        }, 200);
    }

    console.log(
        "✦ SonicFlow mood engine ready"
    );

}


// Start

initializeSequencer();