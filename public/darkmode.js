// /public/darkmode.js
// Handles initial dark mode and toggle
(function() {
  // Set initial theme before paint
  const theme = localStorage.theme;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Toggle button logic
  document.addEventListener("DOMContentLoaded", function() {
    const t = document.getElementById("dark-mode-toggle");
    if (!t) return;
    function setTheme(e) {
      localStorage.theme = e;
      if (e === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    function updateButton() {
      if (!t) return;
      if (document.documentElement.classList.contains("dark")) {
        t.textContent = "☀️ Light Mode";
      } else {
        t.textContent = "🌙 Dark Mode";
      }
    }
    updateButton();
    t.addEventListener("click", function() {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
      updateButton();
      console.log("Toggle clicked. <html> classes:", document.documentElement.className);
    });
  });
})();
