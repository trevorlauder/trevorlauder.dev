---
title: DevOps • Code • Photography
layout: splash
header:
  overlay_color: "#0B0D0F"
  overlay_filter: "rgba(11, 13, 15, 0.42)"
  overlay_image: /assets/images/splash.svg
excerpt: Shipping code, chasing light.
gallery:
  - url: /assets/photos/DSC_6181.webp
    image_path: /assets/photos/thumbnails/DSC_6181.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6156.webp
    image_path: /assets/photos/thumbnails/DSC_6156.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6146.webp
    image_path: /assets/photos/thumbnails/DSC_6146.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6119.webp
    image_path: /assets/photos/thumbnails/DSC_6119.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6110.webp
    image_path: /assets/photos/thumbnails/DSC_6110.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6106.webp
    image_path: /assets/photos/thumbnails/DSC_6106.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6076.webp
    image_path: /assets/photos/thumbnails/DSC_6076.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6011.webp
    image_path: /assets/photos/thumbnails/DSC_6011.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6008.webp
    image_path: /assets/photos/thumbnails/DSC_6008.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6007.webp
    image_path: /assets/photos/thumbnails/DSC_6007.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/DSC_6005.webp
    image_path: /assets/photos/thumbnails/DSC_6005.jpg.webp
    title: Dry Island Buffalo Jump Provincial Park
  - url: /assets/photos/P7250020.webp
    image_path: /assets/photos/thumbnails/P7250020.jpg.webp
    title: Sylvan Lake, Alberta, Canada
  - url: /assets/photos/DSC_5856.webp
    image_path: /assets/photos/thumbnails/DSC_5856.jpg.webp
    title: Comet C/2020 F3 (NEOWISE)
  - url: /assets/photos/P7160043.webp
    image_path: /assets/photos/thumbnails/P7160043.jpg.webp
    title: Comet C/2020 F3 (NEOWISE)
  - url: /assets/photos/P6050177.webp
    image_path: /assets/photos/thumbnails/P6050177.jpg.webp
    title: Lighthouse @ Sylvan Lake, Alberta, Canada
  - url: /assets/photos/DSC_0053-Min Horizon Noise.webp
    image_path: /assets/photos/thumbnails/DSC_0053-Min Horizon Noise.jpg.webp
    title: Milky Way w/ Andromeda
  - url: /assets/photos/DSC_0047-Max Value.webp
    image_path: /assets/photos/thumbnails/DSC_0047-Max Value.jpg.webp
    title: Milky Way
  - url: /assets/photos/DSC_0041-Max Value.webp
    image_path: /assets/photos/thumbnails/DSC_0041-Max Value.jpg.webp
    title: Milky Way
intro:
  - excerpt: All images are © Trevor Lauder.<br>[Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
---

{% include feature_row id="intro" type="center" %}

{% include gallery class="full masonry" %}

<script>
// Deterministic daily tagline (client-side) using _data/taglines.json.
// Runs AFTER window load to avoid production (main.min.js) rewrites.
// Uses dedicated span; fade removed for simplicity.
(function() {
  var taglines = {{ site.data.taglines | jsonify }};
  var hasList = Array.isArray(taglines) && taglines.length > 0;

  // Mountain Time date parts (numeric)
  function mountainDateParts(){
    var fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year:'numeric', month:'2-digit', day:'2-digit' });
    var p = fmt.formatToParts(new Date());
    return {
      y: parseInt(p.find(q=>q.type==='year').value,10),
      m: parseInt(p.find(q=>q.type==='month').value,10),
      d: parseInt(p.find(q=>q.type==='day').value,10)
    };
  }
  // Simple random selection each visit (no persistence beyond page load)
  function chooseRandom(list){
    if(!list.length) return '';
    return list[Math.floor(Math.random() * list.length)];
  }

  function setDailyTagline(){
    var container = document.querySelector('.page__lead');
    if(!container) return;
    var initial = container.querySelector('#dynamic-tagline-initial');
    var fallbackText = initial ? initial.textContent.trim() : '(Loading)';
    // Replace initial span with dynamic span only once
    var el = container.querySelector('#dynamic-tagline');
    if(!el) {
      el = document.createElement('span');
      el.id = 'dynamic-tagline';
      if(initial) initial.replaceWith(el); else container.appendChild(el);
    }

    if(!hasList){
      // No list available; keep fallback text visible
      if(el.textContent.trim() !== fallbackText) el.textContent = fallbackText;
      return;
    }

  var desired = chooseRandom(taglines) || fallbackText;
  if(el.textContent.trim() !== desired) fadeSwap(el, desired);

    // Lightweight polling fallback (covers late hydration scripts)
      // Brief guard in case theme scripts rewrite early
      var start = Date.now();
      var pollInterval = 400;
      var poller = setInterval(function(){
        if(Date.now() - start > 4000) { clearInterval(poller); return; }
        if(!document.body.contains(el)) clearInterval(poller);
        else if(el.textContent.trim() === '' ) el.textContent = chooseRandom(taglines) || fallbackText;
      }, pollInterval);
      window.addEventListener('pageshow', function(){ if(el.textContent.trim() === '') el.textContent = chooseRandom(taglines) || fallbackText; }, { once:true });
  }

  function fadeSwap(el, text){
    // Preserve height to mitigate layout shift
    if(!el.style.minHeight) { el.style.minHeight = el.offsetHeight + 'px'; }
    el.style.opacity = 0;
    setTimeout(function(){
      el.textContent = text;
      requestAnimationFrame(function(){ el.style.opacity = 1; });
    }, 120);
  }

  function initiate(){
    // Delay a tick to allow late theme mutations
    setTimeout(function(){
      setDailyTagline();
      // Short intensive guard phase (first 5s after load)
      var start = Date.now();
      var container = document.querySelector('.page__lead');
      var desired = container && container.querySelector('#dynamic-tagline') && container.querySelector('#dynamic-tagline').textContent.trim();
      if(!container || !desired) return;
      function guard(){
        if(Date.now() - start > 5000) return; // stop after 5s
        // If something rewrote the container text, rebuild span
        var span = container.querySelector('#dynamic-tagline');
        if(!span || span.textContent.trim() !== desired){
          container.setAttribute('data-dynamic-tagline', 'locked');
          container.innerHTML = '<span id="dynamic-tagline" class="tagline-fade-transition">'+desired+'</span>';
        }
        requestAnimationFrame(guard);
      }
      requestAnimationFrame(guard);
    }, 50);
  }

  if(document.readyState === 'complete') {
    initiate();
  } else {
    window.addEventListener('load', initiate, { once: true });
  }
})();
</script>
<style>
.tagline-fade-transition { transition: opacity .6s ease; }
</style>
<noscript><style>.page__lead-noscript{display:block;font-style:italic;opacity:.85;margin-top:.5rem}</style><span class="page__lead-noscript">(Static tagline shown – enable JavaScript for daily variation)</span></noscript>
