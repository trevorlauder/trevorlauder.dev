---
permalink: /privacy/
title: Privacy
layout: single
---


This site uses Google Analytics (GA4) and Cloudflare Web Analytics to understand aggregate usage and performance. I aim to minimize data collection and respect your choices.

Cloudflare Web Analytics is injected by Cloudflare automatically, but only for users outside the European Union (EU). If you are visiting from the EU, Cloudflare does not inject its analytics script and no Cloudflare analytics data is collected for your visit.

Google Analytics (GA4) is only loaded if you accept analytics in the consent banner. Both analytics providers respect your privacy choices and Do Not Track settings.

What I do:

- Respect Do Not Track (DNT). If your browser’s DNT is enabled, Google Analytics (GA4) analytics are disabled.
- Consent Mode defaults: ad storage is denied; Google Analytics (GA4) is denied until you accept.
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) is only injected for non-EU users by Cloudflare’s edge logic, and does not use any client-side state, such as cookies or localStorage, to collect usage metrics. They also don’t “fingerprint” individuals via their IP address, User Agent string, or any other data for the purpose of displaying analytics.

Your choices:

- You can accept or reject Google Analytics (GA4) using the banner shown on first visit.
- Cloudflare Web Analytics is not subject to consent for EU users (it is not injected), and is privacy-focused for others.
- You can change your choice for Google Analytics (GA4) any time below.

<button id="reset-consent" class="btn btn--primary" type="button">Change my choice</button>

<script>
  (function(){
    var $btn = document.getElementById('reset-consent');
    if(!$btn) return;
    $btn.addEventListener('click', function(){
      if(window.privacyConsent && typeof window.privacyConsent.reset === 'function') {
        window.privacyConsent.reset();
        alert('Preference cleared. A banner will appear so you can choose again.');
      } else {
        try {
          localStorage.removeItem('consent.analytics');
          alert('Preference cleared. Reload the page.');
        } catch(e) {}
      }
    });
  })();
</script>
