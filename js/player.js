// ============================================
// SONICFLOW 2.0
// MUSIC PLAYER
// ============================================

let currentAudio = null;

let currentSong = null;

let currentSongList = [];

let currentSongIndex = -1;


// ============================================
// PLAYER ELEMENTS
// ============================================

const audioPlayer =
    document.getElementById("audioPlayer");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const playPauseButton =
    document.getElementById("playPauseButton");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const playerProgress =
    document.getElementById("playerProgress");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const playerVolume =
    document.getElementById("playerVolume");


// ============================================
// SET SONG LIST
// ============================================

function setPlayerSongList(songs) {

    currentSongList =
        songs || [];

    console.log(
        "🎵 Player songs:",
        currentSongList
    );

}


// ============================================
// PLAY SONG
// ============================================

function playSong(song, songs = null) {

    if (!song) {

        console.error(
            "❌ No song selected"
        );

        return;

    }


    console.log(
        "▶ Playing:",
        song.title
    );


    // Update song list

    if (songs) {

        setPlayerSongList(
            songs
        );

    }


    // Find current song index

    currentSongIndex =
        currentSongList.findIndex(
            function(item) {

                return String(item.id) ===
                    String(song.id);

            }
        );


    currentSong =
        song;


    // ========================================
    // CHECK AUDIO FILE
    // ========================================

    const audioData = song.audioFile || song.file;

    if (!audioData) {

        console.error(
            "❌ Audio file missing:",
            song
        );

        alert(
            "Audio file is missing for this song."
        );

        return;

    }


    // ========================================
    // STOP PREVIOUS SONG
    // ========================================

    if (currentAudio) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

    }


    // ========================================
    // CREATE AUDIO
    // ========================================

    try {

        currentAudio =
            new Audio(
                URL.createObjectURL(
                    audioData
                )
            );

    }

    catch (error) {

        console.error(
            "❌ Could not create audio:",
            error
        );

        return;

    }


    // ========================================
    // VOLUME
    // ========================================

    let initialVol = 1;
    if (playerVolume) {
        let val = Number(playerVolume.value);
        if (val > 1) val = val / 100;
        initialVol = Math.max(0, Math.min(1, isNaN(val) ? 1 : val));
    }

    currentAudio.volume = initialVol;


    // ========================================
    // UPDATE PLAYER TEXT
    // ========================================

    updatePlayerSongInfo();


    // ========================================
    // AUDIO EVENTS
    // ========================================

    currentAudio.addEventListener(
        "loadedmetadata",
        function() {

            if (durationElement) {

                durationElement.textContent =
                    formatTime(
                        currentAudio.duration
                    );

            }

        }
    );


    currentAudio.addEventListener(
        "timeupdate",
        function() {

            updateProgress();

        }
    );


    currentAudio.addEventListener(
        "play",
        function() {

            updatePlayButton();

        }
    );


    currentAudio.addEventListener(
        "pause",
        function() {

            updatePlayButton();

        }
    );


    currentAudio.addEventListener(
        "ended",
        function() {

            playNextSong();

        }
    );


    currentAudio.addEventListener(
        "error",
        function(error) {

            console.error(
                "❌ Audio error:",
                error
            );

        }
    );


    // ========================================
    // PLAY
    // ========================================

    currentAudio
        .play()
        .then(
            function() {

                console.log(
                    "✅ Now playing:",
                    song.title
                );

                updatePlayButton();

            }
        )
        .catch(
            function(error) {

                console.error(
                    "❌ Play error:",
                    error
                );

            }
        );

}


// ============================================
// UPDATE SONG INFO
// ============================================

function updatePlayerSongInfo() {

    if (!currentSong) {

        return;

    }


    const title = currentSong.title || "Unknown Song";
    const artist = currentSong.artist || "Unknown Artist";
    const mood = currentSong.mood || "—";
    const energy = currentSong.energy ? `${currentSong.energy}/10` : "—";

    const flowTitle = document.getElementById("flowPlayerTitle");
    const flowArtist = document.getElementById("flowPlayerArtist");
    const flowMood = document.getElementById("flowMoodPill");
    const flowEnergy = document.getElementById("flowEnergyPill");
<<<<<<< HEAD
    const playerCover = document.getElementById("playerCover");
=======
>>>>>>> f488952eac721cff9e8db671353847099801d9b0

    if (playerTitle) playerTitle.textContent = title;
    if (playerArtist) playerArtist.textContent = artist;
    if (flowTitle) flowTitle.textContent = title;
    if (flowArtist) flowArtist.textContent = artist;
    if (flowMood) flowMood.textContent = mood;
    if (flowEnergy) flowEnergy.textContent = energy;

<<<<<<< HEAD
    if (playerCover && typeof getSongCoverImage === "function") {
        const coverUrl = getSongCoverImage(currentSong);
        if (coverUrl) {
            playerCover.innerHTML = `<img src="${coverUrl}" alt="${title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;">`;
        }
    }

=======
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
}


// ============================================
// PLAY / PAUSE
// ============================================

function togglePlayPause() {

    // No song selected

    if (!currentAudio) {

        if (
            currentSong &&
            currentSong.audioFile
        ) {

            playSong(
                currentSong,
                currentSongList
            );

        }

        return;

    }


    if (currentAudio.paused) {

        currentAudio
            .play()
            .catch(
                function(error) {

                    console.error(
                        "❌ Resume error:",
                        error
                    );

                }
            );

    }

    else {

        currentAudio.pause();

    }

}


// ============================================
// UPDATE PLAY BUTTON
// ============================================

function updatePlayButton() {

    if (!playPauseButton) {

        return;

    }


    if (
        currentAudio &&
        !currentAudio.paused
    ) {

        playPauseButton.textContent =
            "❚❚";

        playPauseButton.title =
            "Pause";

    }

    else {

        playPauseButton.textContent =
            "▶";

        playPauseButton.title =
            "Play";

    }

}


// ============================================
// NEXT SONG
// ============================================

function playNextSong() {

    if (
        currentSongList.length === 0
    ) {

        console.warn(
            "⚠ No songs available"
        );

        return;

    }


    let nextIndex =
        currentSongIndex + 1;


    if (
        nextIndex >=
        currentSongList.length
    ) {

        nextIndex = 0;

    }


    const nextSong =
        currentSongList[nextIndex];


    playSong(
        nextSong,
        currentSongList
    );

}


// ============================================
// PREVIOUS SONG
// ============================================

function playPreviousSong() {

    if (
        currentSongList.length === 0
    ) {

        return;

    }


    let previousIndex =
        currentSongIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            currentSongList.length - 1;

    }


    const previousSong =
        currentSongList[previousIndex];


    playSong(
        previousSong,
        currentSongList
    );

}


// ============================================
// UPDATE PROGRESS
// ============================================

function updateProgress() {

    if (!currentAudio) {

        return;

    }


    if (
        currentAudio.duration &&
        playerProgress
    ) {

        playerProgress.value =
            (
                currentAudio.currentTime /
                currentAudio.duration
            ) * 100;

    }


    if (currentTimeElement) {

        currentTimeElement.textContent =
            formatTime(
                currentAudio.currentTime
            );

    }


    if (
        durationElement &&
        currentAudio.duration
    ) {

        durationElement.textContent =
            formatTime(
                currentAudio.duration
            );

    }

}


// ============================================
// SEEK
// ============================================

function seekSong(value) {

    if (
        !currentAudio ||
        !currentAudio.duration
    ) {

        return;

    }


    currentAudio.currentTime =
        (
            Number(value) / 100
        ) *
        currentAudio.duration;

}


// ============================================
// VOLUME
// ============================================

function changeVolume(value) {

    if (!currentAudio) {

        return;

    }

    let val = Number(value);
    if (val > 1) val = val / 100;
    currentAudio.volume = Math.max(0, Math.min(1, isNaN(val) ? 1 : val));

}


// ============================================
// FORMAT TIME
// ============================================

function formatTime(seconds) {

    if (
        !seconds ||
        !isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsRemaining =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            secondsRemaining
        ).padStart(2, "0")
    );

}


// ============================================
// PLAY BUTTON EVENT
// ============================================

if (playPauseButton) {

    playPauseButton.addEventListener(
        "click",
        function() {

            togglePlayPause();

        }
    );

}


// ============================================
// NEXT BUTTON EVENT
// ============================================

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function() {

            playNextSong();

        }
    );

}


// ============================================
// PREVIOUS BUTTON EVENT
// ============================================

if (previousButton) {

    previousButton.addEventListener(
        "click",
        function() {

            playPreviousSong();

        }
    );

}


// ============================================
// PROGRESS EVENT
// ============================================

if (playerProgress) {

    playerProgress.addEventListener(
        "input",
        function() {

            seekSong(
                playerProgress.value
            );

        }
    );

}


// ============================================
// VOLUME EVENT
// ============================================

if (playerVolume) {

    playerVolume.addEventListener(
        "input",
        function() {

            changeVolume(
                playerVolume.value
            );

        }
    );

}


// ============================================
// GET CURRENT SONG
// ============================================

function getCurrentSong() {

    return currentSong;

}


// ============================================
// READY
// ============================================

console.log(
    "🎧 SonicFlow Player loaded successfully"
);