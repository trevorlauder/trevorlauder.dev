---
title: DevOps • Code • Photography
layout: splash
header:
  overlay_color: "#0B0D0F"
  overlay_filter: "rgba(11, 13, 15, 0.42)"
  overlay_image: /assets/images/splash.svg
excerpt: ""
gallery:
  - url: /assets/photos/optimized/DSC_6181.webp
    image_path: /assets/photos/optimized/DSC_6181.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6156.webp
    image_path: /assets/photos/optimized/DSC_6156.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6146.webp
    image_path: /assets/photos/optimized/DSC_6146.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6119.webp
    image_path: /assets/photos/optimized/DSC_6119.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6110.webp
    image_path: /assets/photos/optimized/DSC_6110.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6106.webp
    image_path: /assets/photos/optimized/DSC_6106.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6076.webp
    image_path: /assets/photos/optimized/DSC_6076.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6011.webp
    image_path: /assets/photos/optimized/DSC_6011.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6008.webp
    image_path: /assets/photos/optimized/DSC_6008.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6007.webp
    image_path: /assets/photos/optimized/DSC_6007.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/DSC_6005.webp
    image_path: /assets/photos/optimized/DSC_6005.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/optimized/P7250020.webp
    image_path: /assets/photos/optimized/P7250020.webp
    title: Sylvan Lake, Alberta, Canada
  - url: /assets/photos/optimized/DSC_5856.webp
    image_path: /assets/photos/optimized/DSC_5856.webp
    title: Comet C/2020 F3 (NEOWISE)
  - url: /assets/photos/optimized/P7160043.webp
    image_path: /assets/photos/optimized/P7160043.webp
    title: Comet C/2020 F3 (NEOWISE)
  - url: /assets/photos/optimized/P6050177.webp
    image_path: /assets/photos/optimized/P6050177.webp
    title: Lighthouse @ Sylvan Lake, Alberta, Canada
  - url: /assets/photos/optimized/DSC_0053-Min_Horizon_Noise.webp
    image_path: /assets/photos/optimized/DSC_0053-Min_Horizon_Noise.webp
    title: Milky Way w/ Andromeda
  - url: /assets/photos/optimized/DSC_0047-Max_Value.webp
    image_path: /assets/photos/optimized/DSC_0047-Max_Value.webp
    title: Milky Way
  - url: /assets/photos/optimized/DSC_0041-Max_Value.webp
    image_path: /assets/photos/optimized/DSC_0041-Max_Value.webp
    title: Milky Way
intro:
  - excerpt: All images are © Trevor Lauder.<br>[Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
---

{% include feature_row id="intro" type="center" %}

{% include gallery class="full masonry" %}

<script>
(function() {
  var taglines = {{ site.data.taglines | jsonify }};
  if (!Array.isArray(taglines) || !taglines.length) return;
  function chooseRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  function fadeSwap(el, text) {
    el.style.opacity = 0;
    setTimeout(function() {
      el.textContent = text;
      requestAnimationFrame(function() { el.style.opacity = 1; });
    }, 120);
  }
  window.addEventListener('DOMContentLoaded', function() {
    var container = document.querySelector('.page__lead');
    if (!container) return;
    var el = container.querySelector('#dynamic-tagline');
    if (!el) {
      el = document.createElement('span');
      el.id = 'dynamic-tagline';
      container.appendChild(el);
    }
    fadeSwap(el, chooseRandom(taglines));
  });
})();
</script>
<style>
.tagline-fade-transition { transition: opacity .6s ease; }
</style>
<noscript><style>.page__lead-noscript{display:block;font-style:italic;opacity:.85;margin-top:.5rem}</style><span class="page__lead-noscript">(Static tagline shown – enable JavaScript for daily variation)</span></noscript>
