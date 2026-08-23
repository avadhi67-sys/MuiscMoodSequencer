// ============================================
// SONICFLOW 2.0
// ADD SONG
// ============================================


// ============================================
// GET FORM ELEMENTS
// ============================================

const addSongForm =
    document.getElementById("addSongForm");

const songTitle =
    document.getElementById("songTitle");

const songArtist =
    document.getElementById("songArtist");

const artistCountHint =
    document.getElementById("artistCountHint");

const songMood =
    document.getElementById("songMood");

const songEnergy =
    document.getElementById("songEnergy");

const songTempo =
    document.getElementById("songTempo");

const songAudio =
    document.getElementById("songAudio");

const energyValue =
    document.getElementById("energyValue");

const fileName =
    document.getElementById("fileName");

const formMessage =
    document.getElementById("formMessage");


// ============================================
// POPULATE ARTIST DROPDOWN
// ============================================

async function populateArtistDropdown() {
    if (!songArtist) return;

    try {
        let songs = [];
        if (typeof getAllSongs === "function") {
            songs = await getAllSongs();
        } else if (typeof getSongsFromStorage === "function") {
            songs = await getSongsFromStorage();
        }

        const artistCounts = {};

        // Custom profiles from Add Artist
        if (typeof getAllArtistProfiles === "function") {
            const profiles = getAllArtistProfiles();
            profiles.forEach(function(p) {
                const name = (p.name || "").trim();
                if (name) {
                    artistCounts[name] = 0;
                }
            });
        }

        songs.forEach(function(song) {
            const artist = (song.artist || "").trim();
            if (artist) {
                artistCounts[artist] = (artistCounts[artist] || 0) + 1;
            }
        });

        const sortedArtists = Object.keys(artistCounts).sort();

        songArtist.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = sortedArtists.length > 0 
            ? "Select artist..." 
            : "No artists yet";
        songArtist.appendChild(defaultOption);

        sortedArtists.forEach(function(artist) {
            const option = document.createElement("option");
            option.value = artist;
            option.textContent = `${artist} (${artistCounts[artist]} track${artistCounts[artist] === 1 ? "" : "s"})`;
            songArtist.appendChild(option);
        });

        const newOption = document.createElement("option");
        newOption.value = "__NEW__";
        newOption.textContent = "＋ Add New Artist...";
        songArtist.appendChild(newOption);

        if (artistCountHint) {
            artistCountHint.textContent = sortedArtists.length > 0
                ? `${sortedArtists.length} in catalog`
                : "";
        }
    } catch (e) {
        console.warn("Could not load artists for dropdown:", e);
    }
}

populateArtistDropdown();

let previousArtistValue = "";

if (songArtist) {
    songArtist.addEventListener("focus", function() {
        if (songArtist.value !== "__NEW__") {
            previousArtistValue = songArtist.value;
        }
    });

    songArtist.addEventListener("change", function () {
        if (songArtist.value === "__NEW__") {
            const newName = prompt("Enter new artist name:");
            if (newName && newName.trim()) {
                const trimmedName = newName.trim();
                
                // Check if already in options
                let existingOpt = Array.from(songArtist.options).find(function(o) {
                    return o.value.toLowerCase() === trimmedName.toLowerCase();
                });
                
                if (existingOpt) {
                    songArtist.value = existingOpt.value;
                } else {
                    const customOpt = document.createElement("option");
                    customOpt.value = trimmedName;
                    customOpt.textContent = `★ ${trimmedName} (New)`;
                    customOpt.selected = true;
                    songArtist.insertBefore(customOpt, songArtist.lastElementChild);
                    songArtist.value = trimmedName;
                }
            } else {
                songArtist.value = previousArtistValue || "";
            }
        } else {
            previousArtistValue = songArtist.value;
        }
    });
}


// ============================================
// ENERGY VALUE
// ============================================

if (songEnergy && energyValue) {

    songEnergy.addEventListener(
        "input",
        function() {

            energyValue.textContent =
                songEnergy.value;

        }
    );

}


// ============================================
// AUDIO FILE NAME
// ============================================

if (songAudio && fileName) {

    songAudio.addEventListener(
        "change",
        function() {

            if (songAudio.files.length > 0) {

                fileName.textContent =
                    songAudio.files[0].name;

            }
            else {

                fileName.textContent =
                    "Choose an audio file";

            }

        }
    );

}


// ============================================
// SHOW MESSAGE
// ============================================

function showMessage(message, type) {

    if (!formMessage) {
        return;
    }


    formMessage.textContent =
        message;


    formMessage.className =
        "form-message";


    if (type) {

        formMessage.classList.add(type);

    }

}


// ============================================
// FORM SUBMIT
// ============================================

if (addSongForm) {

    addSongForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            showMessage(
                "",
                ""
            );


            // --------------------------------
            // GET VALUES
            // --------------------------------

            const title =
                songTitle.value.trim();

            const artist =
                songArtist.value.trim();

            const mood =
                songMood.value;

            const energy =
                Number(songEnergy.value);

            const tempo =
                Number(songTempo.value);


            // --------------------------------
            // AUDIO FILE
            // --------------------------------

            const audioFile =
                songAudio.files[0];


            // --------------------------------
            // VALIDATION
            // --------------------------------

            if (!title) {

                showMessage(
                    "Please enter the song title.",
                    "error"
                );

                songTitle.focus();

                return;

            }


            if (!artist) {

                showMessage(
                    "Please enter the artist name.",
                    "error"
                );

                songArtist.focus();

                return;

            }


            if (!mood) {

                showMessage(
                    "Please select a mood.",
                    "error"
                );

                songMood.focus();

                return;

            }


            if (
                energy < 1 ||
                energy > 10
            ) {

                showMessage(
                    "Energy must be between 1 and 10.",
                    "error"
                );

                return;

            }


            if (
                tempo < 40 ||
                tempo > 220
            ) {

                showMessage(
                    "BPM must be between 40 and 220.",
                    "error"
                );

                songTempo.focus();

                return;

            }


            if (!audioFile) {

                showMessage(
                    "Please choose an audio file.",
                    "error"
                );

                return;

            }


            // --------------------------------
            // CHECK AUDIO TYPE
            // --------------------------------

            if (
                !audioFile.type.startsWith("audio/")
            ) {

                showMessage(
                    "Please choose a valid audio file.",
                    "error"
                );

                return;

            }


            // --------------------------------
            // CREATE SONG OBJECT
            // --------------------------------

            const song = {

                title: title,

                artist: artist,

                mood: mood,

                energy: energy,

                tempo: tempo,

                audioFile: audioFile,

                createdAt:
                    new Date().toISOString()

            };


            // --------------------------------
            // SAVE SONG
            // --------------------------------

            try {

                showMessage(
                    "Saving your song...",
                    ""
                );


                const songId =
                    await saveSong(song);


                console.log(
                    "🎵 Song saved:",
                    songId
                );


                // --------------------------------
                // SUCCESS
                // --------------------------------

                showMessage(
                    "✓ Song added to your library!",
                    "success"
                );


                // Reset form

                addSongForm.reset();


                // Reset energy display

                if (energyValue) {

                    energyValue.textContent =
                        "5";

                }


                // Reset file name

                if (fileName) {

                    fileName.textContent =
                        "Choose an audio file";

                }


                // --------------------------------
                // REDIRECT TO LIBRARY
                // --------------------------------

                setTimeout(
                    function() {

                        window.location.href =
                            "library.html";

                    },
                    1000
                );

            }


            catch(error) {

                console.error(
                    "❌ Could not save song:",
                    error
                );


                showMessage(
                    "Something went wrong while saving the song.",
                    "error"
                );

            }

        }
    );

}


// ============================================
// READY
// ============================================

console.log(
    "🎵 Add Song module loaded"
);