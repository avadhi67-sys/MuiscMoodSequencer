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
// SIDEBAR COLLAPSE / EXPAND TOGGLE
// ============================================

function initSidebarToggle() {
    const savedState = localStorage.getItem("sonicflow_sidebar_collapsed");
<<<<<<< HEAD
    if (savedState === "true" && window.innerWidth > 900) {
        document.body.classList.add("sidebar-collapsed");
    }

    // Ensure sidebar overlay element exists for mobile drawer
    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }
    overlay.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
    });

    // Close sidebar on link click on mobile
    const sidebarNavLinks = document.querySelectorAll(".sidebar .nav-item");
    sidebarNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                document.body.classList.remove("sidebar-open");
            }
        });
    });

=======
    if (savedState === "true") {
        document.body.classList.add("sidebar-collapsed");
    }

>>>>>>> f488952eac721cff9e8db671353847099801d9b0
    // Auto-inject button into any topbar if missing
    const topbars = document.querySelectorAll(".topbar");
    topbars.forEach(topbar => {
        if (!topbar.querySelector(".sidebar-toggle-btn")) {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "sidebar-toggle-btn";
            toggleBtn.title = "Toggle Sidebar (Hide/Show)";
<<<<<<< HEAD
            toggleBtn.innerHTML = `<span>${(savedState === "true" && window.innerWidth > 900) ? "⇥" : "☰"}</span>`;
=======
            toggleBtn.innerHTML = `<span>${savedState === "true" ? "⇥" : "☰"}</span>`;
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
            toggleBtn.addEventListener("click", toggleSidebar);
            topbar.prepend(toggleBtn);
        }
    });

    const existingToggle = document.getElementById("sidebarToggleBtn");
    if (existingToggle) {
        const span = existingToggle.querySelector("span");
<<<<<<< HEAD
        if (span) span.textContent = (savedState === "true" && window.innerWidth > 900) ? "⇥" : "☰";
=======
        if (span) span.textContent = savedState === "true" ? "⇥" : "☰";
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
        existingToggle.onclick = toggleSidebar;
    }
}

function toggleSidebar() {
<<<<<<< HEAD
    if (window.innerWidth <= 900) {
        const isOpen = document.body.classList.toggle("sidebar-open");
        const toggleSpans = document.querySelectorAll(".sidebar-toggle-btn span");
        toggleSpans.forEach(span => {
            span.textContent = isOpen ? "✕" : "☰";
        });
    } else {
        const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
        localStorage.setItem("sonicflow_sidebar_collapsed", isCollapsed ? "true" : "false");

        const toggleSpans = document.querySelectorAll(".sidebar-toggle-btn span");
        toggleSpans.forEach(span => {
            span.textContent = isCollapsed ? "⇥" : "☰";
        });
    }
=======
    const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sonicflow_sidebar_collapsed", isCollapsed ? "true" : "false");

    const toggleSpans = document.querySelectorAll(".sidebar-toggle-btn span");
    toggleSpans.forEach(span => {
        span.textContent = isCollapsed ? "⇥" : "☰";
    });
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
}

// Auto-run sidebar setup
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebarToggle);
} else {
    initSidebarToggle();
}
<<<<<<< HEAD
=======

// ============================================
// LOGIN CELEBRATION: ROSE GOLD HARMONIC LIGHT WAVE
// ============================================

function triggerCelebrationEntrance() {
    // Avoid duplicate overlays
    if (document.querySelector(".celebration-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "celebration-overlay";

    // 1. Full-Screen Rose Gold Ambient Bloom Surge
    const surge = document.createElement("div");
    surge.className = "rose-gold-surge";
    overlay.appendChild(surge);

    // 2. High-Performance Rose Gold Prismatic Beam Sweep
    const beam = document.createElement("div");
    beam.className = "rose-gold-beam";
    overlay.appendChild(beam);

    // 3. Central Expanding Rose Gold Shockwaves
    const shockwave1 = document.createElement("div");
    shockwave1.className = "rose-gold-shockwave";
    const shockwave2 = document.createElement("div");
    shockwave2.className = "rose-gold-shockwave rose-gold-shockwave-delayed";
    overlay.appendChild(shockwave1);
    overlay.appendChild(shockwave2);

    // 4. Multi-Layer Rose Gold Harmonic Soundwave (SVG)
    const waveContainer = document.createElement("div");
    waveContainer.className = "rose-gold-wave-container";

    waveContainer.innerHTML = `
        <svg class="rose-gold-wave-svg" viewBox="0 0 1440 380" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="roseGoldGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FFF5F2" stop-opacity="0"/>
                    <stop offset="20%" stop-color="#F7C5B8" stop-opacity="0.95"/>
                    <stop offset="50%" stop-color="#FFF5F2" stop-opacity="1"/>
                    <stop offset="80%" stop-color="#E0A899" stop-opacity="0.95"/>
                    <stop offset="100%" stop-color="#AD525E" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="roseGoldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#FFF5F2" stop-opacity="0"/>
                    <stop offset="30%" stop-color="#E0A899" stop-opacity="0.85"/>
                    <stop offset="50%" stop-color="#FFFFFF" stop-opacity="1"/>
                    <stop offset="70%" stop-color="#F7C5B8" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#AD525E" stop-opacity="0"/>
                </linearGradient>
            </defs>
            
            <!-- Broad Harmonic Ambient Glow Ribbon -->
            <path d="M0,190 Q360,45 720,190 T1440,190" fill="none" stroke="rgba(247,197,184,0.4)" stroke-width="28" stroke-linecap="round"/>
            
            <!-- Primary Rose Gold Light Wave -->
            <path d="M0,190 Q360,25 720,190 T1440,190" fill="none" stroke="url(#roseGoldGrad1)" stroke-width="6.5" stroke-linecap="round"/>
            
            <!-- Secondary Harmonic Counter Wave -->
            <path d="M0,190 Q360,355 720,190 T1440,190" fill="none" stroke="url(#roseGoldGrad2)" stroke-width="4" stroke-linecap="round"/>
            
            <!-- High-Frequency Fine Laser Wave -->
            <path d="M0,190 Q180,95 360,190 T720,190 T1080,190 T1440,190" fill="none" stroke="#FFF5F2" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `;

    // 5. Sparkling Rose Gold Flares along wave crest
    const flarePositions = [
        { left: "20%", top: "44%", size: 28, delay: 0.08 },
        { left: "36%", top: "26%", size: 36, delay: 0.2 },
        { left: "50%", top: "50%", size: 42, delay: 0.15 },
        { left: "66%", top: "70%", size: 34, delay: 0.28 },
        { left: "80%", top: "50%", size: 26, delay: 0.12 }
    ];

    flarePositions.forEach(pos => {
        const flare = document.createElement("span");
        flare.className = "rose-gold-flare";
        flare.textContent = "✦";
        flare.style.left = pos.left;
        flare.style.top = pos.top;
        flare.style.setProperty("--flare-size", `${pos.size}px`);
        flare.style.animationDelay = `${pos.delay}s`;
        waveContainer.appendChild(flare);
    });

    overlay.appendChild(waveContainer);
    document.body.appendChild(overlay);

    // 6. Smooth Hardware-Accelerated Fade Out after 1.4s
    setTimeout(() => {
        overlay.classList.add("fade-out");
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 550);
    }, 1400);
}

// Global expose for testing or manual celebration
window.triggerCelebrationEntrance = triggerCelebrationEntrance;

// 7. Trigger celebration upon fresh login
document.addEventListener("DOMContentLoaded", function() {
    const justLoggedIn = sessionStorage.getItem("sonicflow_just_logged_in");
    if (justLoggedIn === "true") {
        sessionStorage.removeItem("sonicflow_just_logged_in");
        setTimeout(() => {
            triggerCelebrationEntrance();
        }, 150);
    }
});
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
