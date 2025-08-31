import { useState, useEffect } from 'preact/hooks';
import { Image } from 'astro:assets';

export default function GalleryLightboxIsland({ images, initialIndex }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const openHandler = (e) => {
      if (e.detail && typeof e.detail.index === 'number') {
        setCurrentIndex(e.detail.index);
      }
    };
    const keyHandler = (e) => {
      if (currentIndex === -1) return;
      if (e.key === 'Escape') {
        setCurrentIndex(-1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(idx => (idx > 0 ? idx - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(idx => (idx < images.length - 1 ? idx + 1 : 0));
      }
    };
    window.addEventListener('galleryLightboxIsland:open', openHandler);
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('galleryLightboxIsland:open', openHandler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [currentIndex, images.length]);

  if (currentIndex === -1) return null;
  const img = images[currentIndex];

  return (
    <div class="lightbox bg-white text-black dark:bg-black dark:text-white" onClick={() => setCurrentIndex(-1)}>
      <button
        className="lightbox-close dark:text-gray-200"
        aria-label="Close"
        onClick={e => { e.stopPropagation(); setCurrentIndex(-1); }}
      >
        &times;
      </button>
      <Image 
        src={img.full.src || img.full}
        alt=""
        style="max-width:90vw;max-height:90vh;display:block;margin:0 auto;"
        className="bg-white text-black dark:bg-black dark:text-white"
        widths={[200, 400, 800, 1200, 1920]}
      />
      {img.caption && (
        <div class="caption dark:text-gray-200" style="margin:1.5rem auto 0 auto;text-align:center;max-width:90vw;">
          {img.caption}
        </div>
      )}
    </div>
  );
}
