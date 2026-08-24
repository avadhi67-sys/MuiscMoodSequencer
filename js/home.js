// ============================================
// SONICFLOW 2.0
// HOME PAGE INTERACTIVE CONTROLLER & ENGINE
// ============================================

console.log("🚀 SonicFlow Home Controller Initialized");

// ============================================
// INITIALIZATION ON DOM READY
// ============================================

document.addEventListener("DOMContentLoaded", async function () {
    await initHomeMetrics();
    initInstantFlowStudio();
    initHeroShowcaseInteraction();
    initHarmonicRadar();
    initTopbarQuotes();
    initScrollAnimations();
});

// ============================================
// TOPBAR INSPIRATIONAL QUOTE ROTATOR
// ============================================

const TOPBAR_QUOTES = [
    { text: "Where words fail, music speaks.", author: "Hans Christian Andersen" },
    { text: "Music is the shorthand of emotion.", author: "Leo Tolstoy" },
    { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
    { text: "Music expresses that which cannot be put into words.", author: "Victor Hugo" },
    { text: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },
    { text: "Music gives a soul to the universe and wings to the mind.", author: "Plato" },
    { text: "Let your emotions shape your harmonic flow.", author: "SonicFlow" },
    { text: "Music is the soundtrack of our lives.", author: "Dick Clark" }
];

function initTopbarQuotes() {
    const quoteEl = document.getElementById("topbarQuote");
    const authorEl = document.getElementById("topbarQuoteAuthor");
    const contentEl = document.getElementById("topbarQuoteContent");

    if (!quoteEl || !contentEl) return;

    let currentIndex = 0;

    setInterval(() => {
        // Step 1: Smoothly slide up & fade out
        contentEl.classList.add("quote-fade-out");

        setTimeout(() => {
            // Step 2: Swap content & position from below
            currentIndex = (currentIndex + 1) % TOPBAR_QUOTES.length;
            const item = TOPBAR_QUOTES[currentIndex];
            quoteEl.textContent = `"${item.text}"`;
            if (authorEl) authorEl.textContent = `— ${item.author}`;

            contentEl.classList.remove("quote-fade-out");
            contentEl.classList.add("quote-slide-in");

            // Force reflow for smooth animation
            void contentEl.offsetHeight;

            // Step 3: Smoothly slide into place
            requestAnimationFrame(() => {
                contentEl.classList.remove("quote-slide-in");
            });
        }, 300);
    }, 3000);
}

// ============================================
// 1. LIVE LIBRARY METRICS & STATS
// ============================================

async function getLibraryDataSafe() {
    try {
        if (typeof getAllSongs === "function") {
            const songs = await getAllSongs();
            if (Array.isArray(songs)) return songs;
        }
        if (typeof getSongsFromStorage === "function") {
            const songs = await getSongsFromStorage();
            if (Array.isArray(songs)) return songs;
        }
    } catch (e) {
        console.warn("⚠️ Could not load library data:", e);
    }
    return [];
}

async function initHomeMetrics() {
    const songs = await getLibraryDataSafe();
    const totalSongs = songs.length;

    // Elements
    const metricSongsCount = document.getElementById("metricSongsCount");
    const metricDominantMood = document.getElementById("metricDominantMood");
    const metricAvgBpm = document.getElementById("metricAvgBpm");
    const metricFlowScore = document.getElementById("metricFlowScore");
    const heroTotalSongs = document.getElementById("heroTotalSongs");

    if (totalSongs > 0) {
        // Calculate Dominant Mood from real user songs
        const moodCounts = {};
        let totalBpm = 0;
        let validBpmCount = 0;

        songs.forEach(s => {
            const m = (s.mood || "Chill").trim();
            moodCounts[m] = (moodCounts[m] || 0) + 1;
            const bpm = parseInt(s.tempo) || 0;
            if (bpm > 0) {
                totalBpm += bpm;
                validBpmCount++;
            }
        });

        let topMood = "Chill";
        let maxCount = 0;
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topMood = mood;
            }
        });

        const avgBpm = validBpmCount > 0 ? Math.round(totalBpm / validBpmCount) : 118;
        const flowScore = Math.min(99, Math.max(88, 85 + (totalSongs * 2)));

        if (metricSongsCount) metricSongsCount.textContent = totalSongs;
        if (metricDominantMood) metricDominantMood.textContent = topMood;
        if (metricAvgBpm) metricAvgBpm.textContent = `${avgBpm} BPM`;
        if (metricFlowScore) metricFlowScore.textContent = `${flowScore}%`;
        if (heroTotalSongs) heroTotalSongs.textContent = `${totalSongs} Tracks`;
    } else {
        if (metricSongsCount) metricSongsCount.textContent = "0";
        if (metricDominantMood) metricDominantMood.textContent = "Chill";
        if (metricAvgBpm) metricAvgBpm.textContent = "120 BPM";
        if (metricFlowScore) metricFlowScore.textContent = "98%";
        if (heroTotalSongs) heroTotalSongs.textContent = "0 Tracks";
    }
}

// ============================================
// 2. INSTANT FLOW STUDIO (INTERACTIVE GENERATOR)
// ============================================

let currentStudioMood = "Chill";
let currentStudioEnergy = 6;

function initInstantFlowStudio() {
    const moodPills = document.querySelectorAll(".flow-mood-pill");
    const energySlider = document.getElementById("studioEnergySlider");
    const energyValueDisplay = document.getElementById("studioEnergyDisplay");
    const matchScoreDisplay = document.getElementById("studioMatchScore");
    const targetBpmDisplay = document.getElementById("studioTargetBpm");
    const btnLaunchFlow = document.getElementById("btnLaunchStudioFlow");

    // Mood Pills click
    moodPills.forEach(pill => {
        pill.addEventListener("click", function () {
            moodPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
            currentStudioMood = this.getAttribute("data-mood") || "Chill";
            updateStudioPredictions();
        });
    });

    // Energy Slider input
    if (energySlider) {
        energySlider.addEventListener("input", function () {
            currentStudioEnergy = parseInt(this.value, 10);
            if (energyValueDisplay) {
                energyValueDisplay.textContent = `${currentStudioEnergy}/10`;
            }
            updateStudioPredictions();
        });
    }

    function updateStudioPredictions() {
        let baseBpm = 100;
        let matchScore = 96;

        switch (currentStudioMood.toLowerCase()) {
            case "happy":
                baseBpm = 110 + (currentStudioEnergy * 2.5);
                matchScore = 94 + Math.floor(Math.random() * 5);
                break;
            case "chill":
                baseBpm = 75 + (currentStudioEnergy * 2.0);
                matchScore = 96 + Math.floor(Math.random() * 4);
                break;
            case "energetic":
                baseBpm = 124 + (currentStudioEnergy * 2.0);
                matchScore = 98;
                break;
            case "dreamy":
                baseBpm = 88 + (currentStudioEnergy * 1.8);
                matchScore = 95 + Math.floor(Math.random() * 4);
                break;
            case "focus":
                baseBpm = 80 + (currentStudioEnergy * 1.5);
                matchScore = 97;
                break;
            default:
                baseBpm = 105;
                matchScore = 95;
        }

        const minBpm = Math.max(60, Math.round(baseBpm - 5));
        const maxBpm = Math.round(baseBpm + 5);

        if (targetBpmDisplay) {
            targetBpmDisplay.textContent = `${minBpm} - ${maxBpm} BPM`;
        }
        if (matchScoreDisplay) {
            matchScoreDisplay.textContent = `${matchScore}%`;
        }
    }

    // Launch Flow Button
    if (btnLaunchFlow) {
        btnLaunchFlow.addEventListener("click", function (e) {
            e.preventDefault();
            const targetUrl = `sequencer.html?mood=${encodeURIComponent(currentStudioMood)}&energy=${currentStudioEnergy}`;
            
            const currentUser = localStorage.getItem("sonicflow_current_user");
            if (!currentUser) {
                window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}&msg=login_required`;
            } else {
                window.location.href = targetUrl;
            }
        });
    }

    updateStudioPredictions();
}

// ============================================
// 3. HERO SHOWCASE INTERACTION
// ============================================

function initHeroShowcaseInteraction() {
    const showcaseCard = document.querySelector(".showcase-card");
    if (!showcaseCard) return;

    showcaseCard.addEventListener("click", function () {
        const spans = showcaseCard.querySelectorAll(".visual-wave span");
        spans.forEach(span => {
            const newH = Math.min(100, Math.max(30, Math.floor(Math.random() * 80) + 20)) + "px";
            span.style.setProperty("--h", newH);
        });
    });
}

// ============================================
// 4. HARMONIC TRANSITION RADAR
// ============================================

function initHarmonicRadar() {
    const radarNodes = document.querySelectorAll(".radar-mood-node");
    const radarDetailBox = document.getElementById("radarDetailBox");

    const RADAR_DATA = {
        chill: {
            title: "Chill Harmonic Anchor",
            desc: "Low energy baseline (70-95 BPM). Transitioning from Chill to Dreamy yields a 99% Harmonic Match with sub-bass frequency alignment.",
            compatibility: "99% to Dreamy • 92% to Happy"
        },
        dreamy: {
            title: "Dreamy Melodic Gateway",
            desc: "Mid-tempo ambient trajectory (90-110 BPM). Acts as the ideal tonal bridge between relaxed chillout and vibrant daytime rhythms.",
            compatibility: "98% to Happy • 95% to Chill"
        },
        happy: {
            title: "Happy Euphoric Elevation",
            desc: "Uplifting major key progressions (110-126 BPM). Prepares the listener's nervous system for high-energy dance sequences.",
            compatibility: "97% to Energetic • 94% to Dreamy"
        },
        energetic: {
            title: "Energetic Peak Dynamics",
            desc: "Driving high-tempo rhythm (126-145 BPM). SonicFlow locks consecutive key signatures to maintain momentum without fatigue.",
            compatibility: "96% to Happy • 90% to Focus"
        }
    };

    radarNodes.forEach(node => {
        node.addEventListener("mouseenter", function () {
            radarNodes.forEach(n => n.classList.remove("active"));
            this.classList.add("active");
            const mood = this.getAttribute("data-radar") || "chill";
            const info = RADAR_DATA[mood];
            if (info && radarDetailBox) {
                radarDetailBox.innerHTML = `
                    <h4>${info.title}</h4>
                    <p>${info.desc}</p>
                    <div class="radar-compat-tag">${info.compatibility}</div>
                `;
            }
        });
    });
}

// ============================================
// 5. SCROLL REVEAL & DYNAMIC PARALLAX ENGINE
// ============================================

function initScrollAnimations() {
    // 1. Target sections and interactive elements
    const revealConfigs = [
        { selector: ".hero-content", animation: "scroll-reveal-left" },
        { selector: ".hero-showcase", animation: "scroll-reveal-right" },
        { selector: ".metrics-ribbon", animation: "scroll-reveal-scale" },
        { selector: ".section-block", animation: "scroll-reveal" },
        { selector: ".flow-studio-card", animation: "scroll-reveal-scale" },
        { selector: ".harmonic-matrix-card", animation: "scroll-reveal" },
        { selector: ".comparison-card:nth-child(1)", animation: "scroll-reveal-left" },
        { selector: ".comparison-card:nth-child(2)", animation: "scroll-reveal-right" },
        { selector: ".mood-card", animation: "scroll-reveal", stagger: true },
        { selector: ".pipeline-step", animation: "scroll-reveal", stagger: true }
    ];

    revealConfigs.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el, idx) => {
            el.classList.add(config.animation);
            if (config.stagger) {
                const delayClass = `stagger-delay-${(idx % 4) + 1}`;
                el.classList.add(delayClass);
            }
        });
    });

    // 2. IntersectionObserver for entering & leaving viewport
    const animatedElements = document.querySelectorAll(
        ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale"
    );

    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-active");
            } else {
                const rect = entry.boundingClientRect;
                // If user scrolls back UP past the element, reset so it reveals smoothly again
                if (rect.top > window.innerHeight) {
                    entry.target.classList.remove("scroll-active");
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // 3. Smooth Floating Parallax on Background Orbs when scrolling up & down
    const orbOne = document.querySelector(".orb-one");
    const orbTwo = document.querySelector(".orb-two");
    const orbThree = document.querySelector(".orb-three");

    let ticking = false;

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (orbOne) orbOne.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
                if (orbTwo) orbTwo.style.transform = `translate3d(0, ${-scrollY * 0.08}px, 0)`;
                if (orbThree) orbThree.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
