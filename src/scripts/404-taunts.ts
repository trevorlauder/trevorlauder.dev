(function (): void {
  const TAUNTS_JSON_PATH = "/404-taunts.json";
  let taunts: string[] = [];
  let el: HTMLElement | null = null;

  function setRandomTaunt(): void {
    if (!taunts.length || !el) return;
    const idx = Math.floor(Math.random() * taunts.length);
    const t = taunts[idx];
    if (typeof t !== "string" || !t.length) return;
    const h = String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    el.innerHTML = "<p>" + h + "</p>";
  }

  function startTauntRotation(): void {
    setRandomTaunt();
    setInterval(setRandomTaunt, 10000);
  }

  window.addEventListener("DOMContentLoaded", function (): void {
    el = document.getElementById("four-o-four-random-taunt");
    if (!el) return;
    fetch(TAUNTS_JSON_PATH)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length) {
          taunts = data;
          startTauntRotation();
        }
      });
  });
})();
