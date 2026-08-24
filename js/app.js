// ============================================
// SONICFLOW 2.0
// GLOBAL APPLICATION & AUTHENTICATION CONTROLLER
// ============================================

console.log("🎧 SonicFlow App Loaded");

// ============================================
// AUTH STATE & PAGE PROTECTION
// ============================================

const currentUser = JSON.parse(
    localStorage.getItem("sonicflow_current_user")
);

const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

// Protected pages that require authentication
const protectedPages = [
    "sequencer.html",
    "add-song.html",
    "add-artist.html",
    "library.html",
    "artists.html",
    "search.html"
];

// Check if current page is protected
if (protectedPages.includes(currentPage) && !currentUser) {
    console.warn("🔒 Protected page accessed without authentication. Redirecting to login...");
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}&msg=login_required`;
}

// ============================================
// GLOBAL AUTH HELPER
// ============================================

function requireAuth(targetUrl) {
    if (!currentUser) {
        const dest = targetUrl || currentPage;
        window.location.href = `login.html?redirect=${encodeURIComponent(dest)}&msg=login_required`;
        return false;
    }
    return true;
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(function(item) {
    const page = (item.getAttribute("href") || "").split("?")[0].toLowerCase();
    if (page === currentPage) {
        item.classList.add("active");
    } else {
        item.classList.remove("active");
    }
});

// ============================================
// RENDER AUTH UI (TOPBAR & SIDEBAR)
// ============================================

function renderAuthUI() {
    // ----------------------------------------
    // TOPBAR ACTIONS
    // ----------------------------------------
    const topbarActions = document.querySelector(".topbar-actions");
    const profileContainer = document.querySelector(".profile");

    if (topbarActions) {
        // Remove any existing dynamic auth elements
        const existingAuth = topbarActions.querySelector(".topbar-auth");
        if (existingAuth) existingAuth.remove();

        if (currentUser) {
            // Logged-in user
            const name = currentUser.name || "User";
            const firstLetter = name.charAt(0).toUpperCase();

            if (profileContainer) {
                profileContainer.style.display = "flex";
                const profileAvatar = document.getElementById("profileAvatar");
                if (profileAvatar) {
                    profileAvatar.textContent = firstLetter;
                    profileAvatar.title = `${name} (${currentUser.email || ""})`;
                }
            }
        } else {
            // Guest User
            if (profileContainer) {
                profileContainer.style.display = "none";
            }

            const authGroup = document.createElement("div");
            authGroup.className = "topbar-auth";
            authGroup.innerHTML = `
                <a href="login.html" class="topbar-auth-btn topbar-auth-login">Log In</a>
                <a href="signup.html" class="topbar-auth-btn topbar-auth-signup">Sign Up</a>
            `;
            topbarActions.appendChild(authGroup);
        }
    }

    // ----------------------------------------
    // SIDEBAR BOTTOM ACCOUNT / GUEST WIDGET
    // ----------------------------------------
    const sidebarBottom = document.querySelector(".sidebar-bottom");
    const sidebarAccount = document.querySelector(".sidebar-account");

    if (sidebarBottom) {
        const existingGuest = sidebarBottom.querySelector(".sidebar-guest");
        if (existingGuest) existingGuest.remove();

        if (currentUser) {
            // Logged in
            if (sidebarAccount) {
                sidebarAccount.style.display = "flex";
                const name = currentUser.name || "User";
                const firstLetter = name.charAt(0).toUpperCase();

                const sidebarAvatar = document.getElementById("sidebarAvatar");
                if (sidebarAvatar) sidebarAvatar.textContent = firstLetter;

                const sidebarName = document.getElementById("sidebarName");
                if (sidebarName) sidebarName.textContent = name;

                const logoutBtn = document.getElementById("logoutButton");
                if (logoutBtn) {
                    logoutBtn.onclick = handleLogout;
                }
            }
        } else {
            // Guest
            if (sidebarAccount) {
                sidebarAccount.style.display = "none";
            }

            const guestCard = document.createElement("div");
            guestCard.className = "sidebar-guest";
            guestCard.innerHTML = `
                <div class="sidebar-guest-info">
                    <div class="sidebar-guest-avatar">✦</div>
                    <div class="sidebar-guest-text">
                        <strong>Guest User</strong>
                        <span>Sign in for full access</span>
                    </div>
                </div>
                <div class="sidebar-guest-actions">
                    <a href="login.html" class="sidebar-guest-btn sidebar-guest-login">Log In</a>
                    <a href="signup.html" class="sidebar-guest-btn sidebar-guest-signup">Sign Up</a>
                </div>
            `;
            sidebarBottom.appendChild(guestCard);
        }
    }
}

// Run UI render
renderAuthUI();

// ============================================
// LOGOUT HANDLER
// ============================================

function handleLogout() {
    localStorage.removeItem("sonicflow_current_user");
    console.log("🔒 User logged out");
    window.location.href = "index.html";
}

// ============================================
// PROTECTED ACTION INTERCEPTION (FOR GUESTS)
// ============================================

if (!currentUser) {
    // Intercept clicks on links that lead to protected pages
    document.addEventListener("click", function(event) {
        const link = event.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        // Extract base target page
        const targetPage = href.split("?")[0].split("#")[0].toLowerCase();

        if (protectedPages.includes(targetPage)) {
            event.preventDefault();
            console.log(`🔒 Login required for: ${href}`);
            window.location.href = `login.html?redirect=${encodeURIComponent(href)}&msg=login_required`;
        }
    });

    // Intercept sidebar player click
    const sidebarPlayer = document.querySelector(".sidebar-player");
    if (sidebarPlayer) {
        sidebarPlayer.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = "login.html?redirect=sequencer.html&msg=login_required";
        };
    }
}

// ============================================
// TOPBAR SEARCH BAR HANDLER
// ============================================

const searchInputs = document.querySelectorAll(".search-box input, #topbarSearch");

searchInputs.forEach(function(input) {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const query = input.value.trim();
            if (query !== "") {
                const targetUrl = `search.html?q=${encodeURIComponent(query)}`;
                if (!currentUser) {
                    window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}&msg=login_required`;
                } else {
                    window.location.href = targetUrl;
                }
            }
        }
    });
});