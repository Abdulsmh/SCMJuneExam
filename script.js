// Handles tab switching between Contacts and Tasks panels, and dark mode toggle

const THEME_KEY = "scm_theme";

function applyStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}

function updateToggleIcon() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☀️" : "🌙";
}

// Apply theme as early as possible to avoid a flash of the wrong theme
applyStoredTheme();

document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;

            tabButtons.forEach((b) => b.classList.remove("active"));
            panels.forEach((p) => p.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(target).classList.add("active");
        });
    });

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        updateToggleIcon();
        themeToggle.addEventListener("click", () => {
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            if (isDark) {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem(THEME_KEY, "light");
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem(THEME_KEY, "dark");
            }
            updateToggleIcon();
        });
    }

    console.log("Contact & Task Manager loaded successfully!");
});
