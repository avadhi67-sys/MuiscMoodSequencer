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