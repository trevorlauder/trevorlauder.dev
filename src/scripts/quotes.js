
(function () {
  const QUOTES_PATH = "/quotes.json";
  let quotes = [];
  let el = null;
  function setRandomQuote() {
    if (!quotes.length || !el) return;
    const idx = Math.floor(Math.random() * quotes.length);
    const t = quotes[idx];
    if (typeof t !== "string" || !t.length) return;
    const h = String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    el.innerHTML = "<p>" + h + "</p>";
  }
  function startQuoteRotion() {
    setRandomQuote();
    setInterval(setRandomQuote, 10000);
  }
  window.addEventListener("DOMContentLoaded", function () {
    el = document.getElementById("quote");
    if (!el) return;
    fetch(QUOTES_PATH)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          quotes = data;
          startQuoteRotion();
        }
      });
  });
})();
