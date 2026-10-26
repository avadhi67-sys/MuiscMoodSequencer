// ============================================
// SONICFLOW 2.0
// GLOBAL APPLICATION & AUTHENTICATION CONTROLLER
// Express + MongoDB + Role-Based Access Control
// ============================================

console.log("🎧 SonicFlow App Controller Initializing...");

// ============================================
// AUTH STATE
// ============================================

function getStoredUser() {
    try {
        const raw = sessionStorage.getItem("sonicflow_user") || localStorage.getItem("sonicflow_user");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

let currentUser = getStoredUser();

const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

// Page classifications
const adminPages = [
    "admin-dashboard.html",
    "add-song.html",
    "add-artist.html"
];

const protectedPages = [
    "user-dashboard.html",
    "admin-dashboard.html",
    "sequencer.html",
    "add-song.html",
    "add-artist.html",
    "library.html",
    "artists.html",
    "search.html"
];

// 1. Check if unauthenticated user is trying to access protected page
if (protectedPages.includes(currentPage) && !currentUser) {
    console.warn("🔒 Protected page accessed without authentication. Redirecting to login...");
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}&msg=login_required`;
}

// 2. Check if non-admin user is trying to access admin page
if (adminPages.includes(currentPage) && currentUser && currentUser.role !== "admin") {
    console.warn("⛔ Admin page accessed by regular user. Redirecting to user dashboard...");
    alert("⚠️ Access Restricted: Only Administrators can access this page.");
    window.location.href = "user-dashboard.html";
}

// ============================================
// GLOBAL AUTH HELPERS
// ============================================

function requireAuth(targetUrl) {
    if (!currentUser) {
        const dest = targetUrl || currentPage;
        window.location.href = `login.html?redirect=${encodeURIComponent(dest)}&msg=login_required`;
        return false;
    }
    return true;
}

function requireAdmin(targetUrl) {
    if (!currentUser) {
        window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl || currentPage)}&msg=admin_required`;
        return false;
    }
    if (currentUser.role !== "admin") {
        alert("⚠️ Access Denied: Administrator privileges required.");
        window.location.href = "user-dashboard.html";
        return false;
    }
    return true;
}

// ============================================
// RENDER NAVIGATION & ROLE-BASED UI
// ============================================

function renderAuthUI() {
    currentUser = getStoredUser();

    // ----------------------------------------
    // TOPBAR ACTIONS & AVATAR
    // ----------------------------------------
    const topbarActions = document.querySelector(".topbar-actions");
    const profileContainer = document.querySelector(".profile");

    if (topbarActions) {
        const existingAuth = topbarActions.querySelector(".topbar-auth");
        if (existingAuth) existingAuth.remove();

        if (currentUser) {
            const name = currentUser.name || "User";
            const role = currentUser.role || "user";
            const firstLetter = name.charAt(0).toUpperCase();

            if (profileContainer) {
                profileContainer.style.display = "flex";
                const profileAvatar = document.getElementById("profileAvatar");
                if (profileAvatar) {
                    profileAvatar.textContent = firstLetter;
                    profileAvatar.title = `${name} • ${role.toUpperCase()}`;
                    profileAvatar.style.background = role === "admin" 
                        ? "linear-gradient(135deg, #e5a93c, #c28825)" 
                        : "linear-gradient(135deg, #4da8da, #0077b6)";
                }
            }
        } else {
            if (profileContainer) profileContainer.style.display = "none";

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
    // SIDEBAR NAVIGATION CUSTOMIZATION
    // ----------------------------------------
    const nav = document.querySelector(".navigation");
    if (nav) {
        // Find existing role dashboard link if already added
        const existingDashLink = nav.querySelector(".dynamic-dash-link");
        if (existingDashLink) existingDashLink.remove();

        if (currentUser) {
            const dashLink = document.createElement("a");
            dashLink.className = "nav-item dynamic-dash-link";

            if (currentUser.role === "admin") {
                dashLink.href = "admin-dashboard.html";
                dashLink.innerHTML = `
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="#e5a93c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style="color: #e5a93c; font-weight: 600;">Admin Dashboard</span>
                `;
            } else {
                dashLink.href = "user-dashboard.html";
                dashLink.innerHTML = `
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="#4da8da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    <span style="color: #4da8da; font-weight: 600;">User Dashboard</span>
                `;
            }

            // Insert dashboard link at the top of menu
            const firstNav = nav.querySelector(".nav-item");
            if (firstNav) {
                nav.insertBefore(dashLink, firstNav);
            } else {
                nav.prepend(dashLink);
            }
        }

        // Hide "Add Song" and "Add Artist" for regular users
        const addSongLink = nav.querySelector('a[href*="add-song.html"]');
        const addArtistLink = nav.querySelector('a[href*="add-artist.html"]');

        if (currentUser && currentUser.role === "admin") {
            if (addSongLink) addSongLink.style.display = "";
            if (addArtistLink) addArtistLink.style.display = "";
        } else {
            // Hide admin creation links from regular users
            if (addSongLink) addSongLink.style.display = "none";
            if (addArtistLink) addArtistLink.style.display = "none";
        }
    }

    // ----------------------------------------
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ----------------------------------------
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(function (item) {
        const page = (item.getAttribute("href") || "").split("?")[0].toLowerCase();
        if (page === currentPage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // ----------------------------------------
    // SIDEBAR BOTTOM ACCOUNT WIDGET
    // ----------------------------------------
    const sidebarBottom = document.querySelector(".sidebar-bottom");
    const sidebarAccount = document.querySelector(".sidebar-account");

    if (sidebarBottom) {
        const existingGuest = sidebarBottom.querySelector(".sidebar-guest");
        if (existingGuest) existingGuest.remove();

        if (currentUser) {
            if (sidebarAccount) {
                sidebarAccount.style.display = "flex";
                const name = currentUser.name || "User";
                const role = currentUser.role || "user";
                const firstLetter = name.charAt(0).toUpperCase();

                const sidebarAvatar = document.getElementById("sidebarAvatar");
                if (sidebarAvatar) {
                    sidebarAvatar.textContent = firstLetter;
                    sidebarAvatar.style.background = role === "admin"
                        ? "linear-gradient(135deg, #e5a93c, #c28825)"
                        : "linear-gradient(135deg, #4da8da, #0077b6)";
                }

                const sidebarName = document.getElementById("sidebarName");
                if (sidebarName) {
                    sidebarName.textContent = name;
                }

                const sidebarSub = sidebarAccount.querySelector("span");
                if (sidebarSub) {
                    sidebarSub.textContent = role === "admin" ? "👑 Admin" : "🎧 Listener";
                    sidebarSub.style.color = role === "admin" ? "#e5a93c" : "#4da8da";
                    sidebarSub.style.fontWeight = "600";
                }

                const logoutBtn = document.getElementById("logoutButton");
                if (logoutBtn) {
                    logoutBtn.onclick = handleLogout;
                }
            }
        } else {
            if (sidebarAccount) {
                sidebarAccount.style.display = "none";
            }
        }
    }
}

// ============================================
// LOGOUT HANDLER
// ============================================

async function handleLogout() {
    try {
        const apiBase = (typeof window !== "undefined" && window.API_BASE) ? window.API_BASE : "";
        await fetch(`${apiBase}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (e) {
        console.warn("Logout request failed:", e);
    }
    sessionStorage.removeItem("sonicflow_jwt");
    sessionStorage.removeItem("sonicflow_user");
    localStorage.removeItem("sonicflow_jwt");
    localStorage.removeItem("sonicflow_user");
    localStorage.removeItem("sonicflow_current_user");

    console.log("🔒 Logged out successfully");
    window.location.href = "login.html";
}

// Run UI render immediately
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAuthUI);
} else {
    renderAuthUI();
}

// ============================================
// SIDEBAR COLLAPSE / EXPAND TOGGLE & MOBILE DRAWER
// ============================================

function initSidebarToggle() {
    const savedState = localStorage.getItem("sonicflow_sidebar_collapsed");
    if (savedState === "true" && window.innerWidth > 900) {
        document.body.classList.add("sidebar-collapsed");
    }

    if (!document.querySelector(".sidebar-backdrop")) {
        const backdrop = document.createElement("div");
        backdrop.className = "sidebar-backdrop";
        backdrop.addEventListener("click", () => {
            document.body.classList.remove("sidebar-open");
            updateToggleIcons();
        });
        document.body.appendChild(backdrop);
    }

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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
} else {
    initSidebarToggle();
}
