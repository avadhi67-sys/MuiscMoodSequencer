// ============================================
// SONICFLOW AUTHENTICATION CONTROLLER (API-DRIVEN)
// Connects to Express + MongoDB REST API
// ============================================

console.log("🔐 SonicFlow API Auth Loaded");

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const redirectParam = urlParams.get("redirect");
const msgParam = urlParams.get("msg");

// Update switch links to preserve redirect param
const authSwitchLinks = document.querySelectorAll(".auth-switch a");
authSwitchLinks.forEach(function (link) {
    if (redirectParam) {
        const baseHref = link.getAttribute("href").split("?")[0];
        link.setAttribute("href", `${baseHref}?redirect=${encodeURIComponent(redirectParam)}`);
    }
});

// Helper: Show Message
function showAuthMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = "auth-message " + (type || "");
    el.style.display = text ? "block" : "none";
}

// Initial redirect notice
document.addEventListener("DOMContentLoaded", function () {
    const loginMsg = document.getElementById("loginMessage");
    const authMsg = document.getElementById("authMessage");

    if (msgParam === "login_required" || redirectParam) {
        const message = "✦ Please log in or sign up first to access this feature.";
        if (loginMsg) showAuthMessage(loginMsg, message, "error");
        else if (authMsg) showAuthMessage(authMsg, message, "error");
    } else if (msgParam === "admin_required") {
        const message = "⚠️ Administrator access is required for that action.";
        if (loginMsg) showAuthMessage(loginMsg, message, "error");
    }

    // Role Card Selection Feedback (Active Border & Glow)
    const roleCards = document.querySelectorAll(".role-card");
    const hiddenRoleInput = document.getElementById("signupRole");

    if (roleCards.length > 0 && hiddenRoleInput) {
        roleCards.forEach(function (card) {
            function selectThisRole() {
                roleCards.forEach(function (c) { c.classList.remove("active"); });
                card.classList.add("active");
                const chosen = card.getAttribute("data-role") || "user";
                hiddenRoleInput.value = chosen;
            }

            card.addEventListener("click", selectThisRole);
            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectThisRole();
                }
            });
        });
    }
});

// ============================================
// SIGNUP HANDLER (API)
// ============================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const roleSelect = document.getElementById("signupRole");
        const role = roleSelect ? roleSelect.value : "user";
        const messageEl = document.getElementById("authMessage");

        if (!name || !email || !password || !confirmPassword) {
            showAuthMessage(messageEl, "Please fill in all fields.", "error");
            return;
        }

        if (password.length < 6) {
            showAuthMessage(messageEl, "Password must be at least 6 characters long.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showAuthMessage(messageEl, "Passwords do not match.", "error");
            return;
        }

        showAuthMessage(messageEl, "Creating your SonicFlow account in MongoDB...", "");

        try {
            const apiBase = (typeof window !== "undefined" && window.API_BASE) ? window.API_BASE : "";
            const response = await fetch(`${apiBase}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (!response.ok) {
                showAuthMessage(messageEl, data.message || "Registration failed.", "error");
                return;
            }

            // Save session credentials
            sessionStorage.setItem("sonicflow_jwt", data.token);
            sessionStorage.setItem("sonicflow_user", JSON.stringify(data.user));
            localStorage.setItem("sonicflow_jwt", data.token);
            localStorage.setItem("sonicflow_user", JSON.stringify(data.user));

            showAuthMessage(
                messageEl,
                `Account created as ${data.user.role === "admin" ? "Studio Admin" : "Listener"}! Redirecting...`,
                "success"
            );

            setTimeout(function () {
                if (redirectParam) {
                    window.location.href = decodeURIComponent(redirectParam);
                } else if (data.user.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "user-dashboard.html";
                }
            }, 800);
        } catch (err) {
            console.error("Signup network error:", err);
            showAuthMessage(messageEl, "Connection error. Make sure server is running.", "error");
        }
    });
}

// ============================================
// LOGIN HANDLER (API)
// ============================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const messageEl = document.getElementById("loginMessage");

        if (!email || !password) {
            showAuthMessage(messageEl, "Please enter both email and password.", "error");
            return;
        }

        showAuthMessage(messageEl, "Verifying credentials with database...", "");

        try {
            const apiBase = (typeof window !== "undefined" && window.API_BASE) ? window.API_BASE : "";
            const response = await fetch(`${apiBase}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                showAuthMessage(messageEl, data.message || "Invalid credentials.", "error");
                return;
            }

            // Save session credentials
            sessionStorage.setItem("sonicflow_jwt", data.token);
            sessionStorage.setItem("sonicflow_user", JSON.stringify(data.user));
            localStorage.setItem("sonicflow_jwt", data.token);
            localStorage.setItem("sonicflow_user", JSON.stringify(data.user));

            showAuthMessage(
                messageEl,
                `Welcome back, ${data.user.name} (${data.user.role.toUpperCase()})! Redirecting...`,
                "success"
            );

            setTimeout(function () {
                if (redirectParam) {
                    window.location.href = decodeURIComponent(redirectParam);
                } else if (data.user.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "user-dashboard.html";
                }
            }, 800);
        } catch (err) {
            console.error("Login network error:", err);
            showAuthMessage(messageEl, "Connection error. Make sure server is running.", "error");
        }
    });
}

// Quick Demo Login Fill Helper for evaluation testing (with Active Border & Glow Feedback)
function quickFillLogin(role) {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const btnAdmin = document.getElementById("btnFillAdmin");
    const btnUser = document.getElementById("btnFillUser");
    const pill = document.getElementById("demoActivePill");

    if (btnAdmin) btnAdmin.classList.remove("active");
    if (btnUser) btnUser.classList.remove("active");

    if (role === "admin") {
        if (emailInput) emailInput.value = "admin@sonicflow.com";
        if (passwordInput) passwordInput.value = "admin123";
        if (btnAdmin) btnAdmin.classList.add("active");
        if (pill) {
            pill.textContent = "✓ Admin Selected";
            pill.className = "demo-active-pill admin";
        }
    } else {
        if (emailInput) emailInput.value = "user@sonicflow.com";
        if (passwordInput) passwordInput.value = "user123";
        if (btnUser) btnUser.classList.add("active");
        if (pill) {
            pill.textContent = "✓ User Selected";
            pill.className = "demo-active-pill user";
        }
    }

    // Input flash feedback
    [emailInput, passwordInput].forEach(function (inp) {
        if (!inp) return;
        inp.style.transition = "border-color 0.25s ease, box-shadow 0.25s ease";
        const accent = role === "admin" ? "#ff4d6d" : "#00d2ff";
        inp.style.borderColor = accent;
        inp.style.boxShadow = "0 0 0 3px " + (role === "admin" ? "rgba(255, 77, 109, 0.3)" : "rgba(0, 210, 255, 0.3)");
        setTimeout(function () {
            inp.style.borderColor = "";
            inp.style.boxShadow = "";
        }, 600);
    });
}
window.quickFillLogin = quickFillLogin;
