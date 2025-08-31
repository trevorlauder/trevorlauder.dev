// /public/gallery-links.js
// Ensures all links in #gallery-markdown-top open in a new tab with rel="noopener noreferrer"
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('gallery-markdown-top');
  if (container) {
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }
});
