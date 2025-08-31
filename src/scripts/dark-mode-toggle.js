(function() {
  const btn = document.getElementById('dark-mode-toggle');
  function updateButton() {
    const isDark = document.documentElement.classList.contains('dark');
    btn.setAttribute('aria-pressed', isDark);
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  btn.addEventListener('click', function() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
    updateButton();
  });
  // Observe class changes for external toggles
  new MutationObserver(updateButton).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  // Initial state
  updateButton();
})();
