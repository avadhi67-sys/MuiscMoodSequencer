// ============================================
// SONICFLOW 2.0
// APP
// ============================================

console.log("🎧 SonicFlow 2.0 loaded");


// ============================================
// GET CURRENT USER
// ============================================

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "sonicflow_current_user"
        )
    );


// ============================================
// PROTECT HOME PAGE
// ============================================

if (!currentUser) {

    window.location.href =
        "login.html";

}


// ============================================
// ACTIVE NAVIGATION
// ============================================

const currentPage =
    window.location.pathname
        .split("/")
        .pop() || "index.html";


const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(function(item) {

    const page =
        item.getAttribute("href");


    if (page === currentPage) {

        item.classList.add(
            "active"
        );

    }

});


// ============================================
// DISPLAY CURRENT USER
// ============================================

if (currentUser) {

    const name =
        currentUser.name || "User";


    // Get first letter
    const firstLetter =
        name
            .charAt(0)
            .toUpperCase();


    // ----------------------------------------
    // TOP RIGHT AVATAR
    // ----------------------------------------

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    if (profileAvatar) {

        profileAvatar.textContent =
            firstLetter;

    }


    // ----------------------------------------
    // SIDEBAR AVATAR
    // ----------------------------------------

    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );


    if (sidebarAvatar) {

        sidebarAvatar.textContent =
            firstLetter;

    }


    // ----------------------------------------
    // SIDEBAR NAME
    // ----------------------------------------

    const sidebarName =
        document.getElementById(
            "sidebarName"
        );


    if (sidebarName) {

        sidebarName.textContent =
            name;

    }


    console.log(
        `Welcome back, ${name} ✦`
    );

}


// ============================================
// LOGOUT
// ============================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "sonicflow_current_user"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ============================================
// SEARCH
// ============================================

const searchInput =
    document.querySelector(
        ".search-box input"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                const query =
                    searchInput.value
                        .trim();


                if (query !== "") {

                    window.location.href =
                        `search.html?q=${encodeURIComponent(query)}`;

                }

            }

        }
    );

}