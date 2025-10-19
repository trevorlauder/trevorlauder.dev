/**
 * Generic utility for rotating random content with HTML-safe display
 * Used by both quotes and 404 taunts
 */

interface RotatorConfig {
  jsonPath: string;
  elementId: string;
  rotationInterval?: number;
}

export function initializeRotator(config: RotatorConfig): void {
  const { jsonPath, elementId, rotationInterval = 10000 } = config;
  let items: string[] = [];
  let el: HTMLElement | null = null;

  function setRandomItem(): void {
    if (!items.length || !el) return;
    const idx = Math.floor(Math.random() * items.length);
    const item = items[idx];
    if (typeof item !== "string" || !item.length) return;
    // HTML-safe escaping
    const sanitized = String(item).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    el.innerHTML = `<p>${sanitized}</p>`;
  }

  function startRotation(): void {
    setRandomItem();
    setInterval(setRandomItem, rotationInterval);
  }

  window.addEventListener("DOMContentLoaded", function (): void {
    el = document.getElementById(elementId);
    if (!el) return;
    fetch(jsonPath)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length) {
          items = data;
          startRotation();
        }
      });
  });
}
