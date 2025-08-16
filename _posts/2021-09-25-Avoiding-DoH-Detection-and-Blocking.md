---
title: Avoiding DNS over HTTPS Detection and Blocking
categories:
  - Blog
tags:
  - JavaScript
  - Personal Projects
  - Cloudflare Workers
  - DNS over HTTPS (DoH)
  - NextDNS
description: How to avoid DNS over HTTPS detection and blocking
header:
  teaser: /assets/images/teasers/doh-avoidance.svg
  og_image: /assets/images/teasers/doh-avoidance.png
image:
  path: /assets/images/teasers/doh-avoidance.png
  width: 1200
  height: 630
---

All of our devices use _DNS over HTTPS_ (DoH). Our kids have supervised iPhones which prevent the DoH profile from being removed, and they don't have root access on their laptops (Chromebooks w/ Ubuntu) which means they can't change the system DoH settings.

Recently the school board started blocking NextDNS, which essentially broke all connections from their devices while on the school WiFi.

To get around the restrictions, I spun up a [Cloudflare Worker](https://workers.cloudflare.com) that reverse-proxies connections to NextDNS. Now their devices point to that worker over TLS 1.3. Problem solved!

```javascript
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  var url = new URL(request.url)

  if (/^\/masked\/path\/.*/.test(url.pathname)) {
    url.hostname = "dns.nextdns.io"
    url.pathname = url.pathname.replace("/masked/path", "")

    let response = await fetch(url, request)

    return response
  } else {
    let init = {
      status: 404
    }

    let body = "Nope, Nope, Nope!"

    return new Response(body, init)
  }
}
```
