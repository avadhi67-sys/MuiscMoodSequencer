// ==========================================================================
// SONICFLOW ADD ARTIST CONTROLLER
// Handles artist profile creation & artwork ingestion
// ==========================================================================

(function () {
    "use strict";

    console.log("🎤 Add Artist module loading...");

    const addArtistForm = document.getElementById("addArtistForm");
    const artistNameInput = document.getElementById("artistNameInput");
    const artistBio = document.getElementById("artistBio");
    const artistImageFile = document.getElementById("artistImageFile");
    const artistAvatarPreview = document.getElementById("artistAvatarPreview");
    const artistImageName = document.getElementById("artistImageName");
    const artistFormMessage = document.getElementById("artistFormMessage");

    let uploadedImageDataUrl = "";

    // ==========================================================================
    // IMAGE UPLOAD & PREVIEW
    // ==========================================================================

    if (artistImageFile) {
        artistImageFile.addEventListener("change", function () {
            if (artistImageFile.files && artistImageFile.files[0]) {
                const file = artistImageFile.files[0];

                if (!file.type.startsWith("image/")) {
                    showMessage("Please select a valid image file.", "error");
                    return;
                }

                // File size check (< 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showMessage("Image size should be less than 5MB.", "error");
                    return;
                }

                if (artistImageName) {
                    artistImageName.textContent = file.name;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    uploadedImageDataUrl = e.target.result;
                    if (artistAvatarPreview) {
                        artistAvatarPreview.innerHTML = `<img src="${uploadedImageDataUrl}" alt="Artist Preview">`;
                    }
                };
                reader.onerror = function () {
                    showMessage("Failed to read image file.", "error");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================================================
    // FORM SUBMIT
    // ==========================================================================

    if (addArtistForm) {
        addArtistForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = artistNameInput ? artistNameInput.value.trim() : "";
            const bio = artistBio ? artistBio.value.trim() : "";

            if (!name) {
                showMessage("Please enter the artist name.", "error");
                if (artistNameInput) artistNameInput.focus();
                return;
            }

            showMessage("Saving artist profile...", "");

            const artistData = {
                name: name,
                bio: bio,
                image: uploadedImageDataUrl || ""
            };

            const saved = saveArtistProfile(artistData);

            if (saved) {
                showMessage("✓ Artist profile saved successfully!", "success");
                addArtistForm.reset();

                setTimeout(function () {
                    window.location.href = "artists.html";
                }, 900);
            } else {
                showMessage("Failed to save artist profile.", "error");
            }
        });
    }

    function showMessage(msg, type) {
        if (!artistFormMessage) return;

        artistFormMessage.textContent = msg;
        artistFormMessage.className = `form-message ${type}`;
        artistFormMessage.style.display = msg ? "block" : "none";
    }
})();
