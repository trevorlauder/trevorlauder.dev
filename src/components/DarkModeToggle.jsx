import { useEffect, useState } from 'preact/hooks';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync with <html> class on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    // Listen for changes from other scripts/tabs
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function toggleDark() {
    const next = !isDark;
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
