---
title: Cloudflare DoH Worker — fan-out to multiple providers, logging, and 1‑click deploy
categories:
  - Blog
tags:
  - JavaScript
  - Personal Projects
  - Cloudflare Workers
  - DNS over HTTPS (DoH)
  - NextDNS
  - Quad9
  - Cloudflare DNS
  - Grafana Loki
  - Docker
  - Workerd
description: A follow-up to my 2021 DoH post—now proxy to multiple providers in parallel, combine their filtering, and ship logs to Grafana Loki. Includes one‑click deploy and a simple config.
header:
  teaser: /assets/images/teasers/doh-avoidance.svg
  og_image: /assets/images/teasers/doh-avoidance.png
image:
  path: /assets/images/teasers/doh-avoidance.png
  width: 1200
  height: 630
---

Back in 2021 I wrote about keeping our family’s devices on DNS over HTTPS even when networks tried to block it. That stopgap proxied to a single provider. This follow-up takes the idea further: a Cloudflare Worker that can fan out DoH requests to multiple providers in parallel, combine their filtering decisions, and optionally send structured logs to Grafana Loki—complete with a 1‑click deploy.

- Project: [https://github.com/trevorlauder/cloudflare-doh-worker](https://github.com/trevorlauder/cloudflare-doh-worker)
- 2021 post for background: [Avoiding DNS over HTTPS Detection and Blocking](/blog/2021/09/25/Avoiding-DoH-Detection-and-Blocking/)

## What’s new

- Multi-provider fan-out: Query any number of DoH providers in parallel.
- Combine filtering: If any provider blocks a domain, the worker can block it (while still letting you choose a “main” provider to source the final response).
- Per-endpoint config: Define multiple paths, each with its own provider set and headers.
- NextDNS headers: Optionally set device name/model and profile path per endpoint.
- Logging to Grafana Loki: Ship request metadata for your own dashboards and alerts.
- One‑click Deploy to Cloudflare: Spin it up fast, then tweak `wrangler.toml` and `src/config.js`.
- Local/dev via Docker + workerd: Run it locally if you want.

Looking to try it? See the [README](https://github.com/trevorlauder/cloudflare-doh-worker) for setup, configuration, deploy, and Docker/workerd usage.
