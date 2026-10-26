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

// Quick Demo Login Fill Helper for evaluation testing
function quickFillLogin(role) {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    if (!emailInput || !passwordInput) return;

    if (role === "admin") {
        emailInput.value = "admin@sonicflow.com";
        passwordInput.value = "admin123";
    } else {
        emailInput.value = "user@sonicflow.com";
        passwordInput.value = "user123";
    }
}
window.quickFillLogin = quickFillLogin;
