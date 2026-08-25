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
            // Guest - Hide sidebar account and do not show guest card in sidebar
            if (sidebarAccount) {
                sidebarAccount.style.display = "none";
            }
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
// SIDEBAR COLLAPSE / EXPAND TOGGLE & MOBILE DRAWER
// ============================================

function initSidebarToggle() {
    const savedState = localStorage.getItem("sonicflow_sidebar_collapsed");
    if (savedState === "true" && window.innerWidth > 900) {
        document.body.classList.add("sidebar-collapsed");
    }

    // Auto-inject backdrop for mobile if missing
    if (!document.querySelector(".sidebar-backdrop")) {
        const backdrop = document.createElement("div");
        backdrop.className = "sidebar-backdrop";
        backdrop.addEventListener("click", () => {
            document.body.classList.remove("sidebar-open");
            updateToggleIcons();
        });
        document.body.appendChild(backdrop);
    }

    // Auto-inject button into any topbar if missing
    const topbars = document.querySelectorAll(".topbar");
    topbars.forEach(topbar => {
        if (!topbar.querySelector(".sidebar-toggle-btn")) {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "sidebar-toggle-btn";
            toggleBtn.title = "Toggle Sidebar";
            toggleBtn.innerHTML = `<span>☰</span>`;
            toggleBtn.addEventListener("click", toggleSidebar);
            topbar.prepend(toggleBtn);
        }
    });

    const existingToggle = document.getElementById("sidebarToggleBtn");
    if (existingToggle) {
        existingToggle.onclick = toggleSidebar;
    }

    // Close mobile drawer when clicking navigation links
    const navLinks = document.querySelectorAll(".sidebar .nav-item, .sidebar a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                document.body.classList.remove("sidebar-open");
                updateToggleIcons();
            }
        });
    });

    updateToggleIcons();
}

function updateToggleIcons() {
    const toggleSpans = document.querySelectorAll(".sidebar-toggle-btn span");
    if (window.innerWidth <= 900) {
        const isOpen = document.body.classList.contains("sidebar-open");
        toggleSpans.forEach(span => {
            span.textContent = isOpen ? "✕" : "☰";
        });
    } else {
        const isCollapsed = document.body.classList.contains("sidebar-collapsed");
        toggleSpans.forEach(span => {
            span.textContent = isCollapsed ? "⇥" : "☰";
        });
    }
}

function toggleSidebar() {
    if (window.innerWidth <= 900) {
        document.body.classList.toggle("sidebar-open");
    } else {
        const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
        localStorage.setItem("sonicflow_sidebar_collapsed", isCollapsed ? "true" : "false");
    }
    updateToggleIcons();
}

window.addEventListener("resize", updateToggleIcons);

// Auto-run sidebar setup
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
} else {
    initSidebarToggle();
}
