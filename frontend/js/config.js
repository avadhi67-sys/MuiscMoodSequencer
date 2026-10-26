// =========================================================================
// SONICFLOW API CONFIGURATION (Frontend Integration)
// =========================================================================
// EVALUATION REQUIREMENT:
// "Replace the local backend URL with the deployed API URL and use MongoDB for data storage."
//
// 1. LOCAL DEVELOPMENT:
//    Leave DEPLOYED_BACKEND_URL as "" (empty).
//    When running via VS Code Live Server (port 5500) or file://, it connects to http://localhost:5000.
//    When running directly on port 5000, it uses relative paths.
//
// 2. BACKEND DEPLOYMENT:
//    Once your backend is deployed (e.g. Render / Railway / Vercel),
//    paste your live deployed backend URL below:
//    Example: const DEPLOYED_BACKEND_URL = "https://sonicflow-backend.onrender.com";
// =========================================================================

const DEPLOYED_BACKEND_URL = ""; // <-- PASTE YOUR DEPLOYED BACKEND URL HERE AFTER DEPLOYING

(function () {
    let apiBase = "";

    if (DEPLOYED_BACKEND_URL && DEPLOYED_BACKEND_URL.trim() !== "") {
        apiBase = DEPLOYED_BACKEND_URL.trim().replace(/\/$/, "");
    } else if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:"
    ) {
        if (window.location.port !== "5000") {
            apiBase = "http://localhost:5000";
        } else {
            apiBase = "";
        }
    } else {
        // Fallback for cloud static hosts
        apiBase = "";
    }

    window.API_BASE = apiBase;
    console.log("🌐 SonicFlow API Base URL configured:", window.API_BASE || "(same-origin / relative)");
})();
