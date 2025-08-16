---
title: Blissful Nights Adjustable Bed API
categories:
  - Blog
tags:
  - Python
  - Personal Projects
  - Reverse Engineering
description: Reverse-engineered adjustable bed API
header:
  teaser: /assets/images/teasers/adjustable-bed-api.svg
  og_image: /assets/images/teasers/adjustable-bed-api.png
image:
  path: /assets/images/teasers/adjustable-bed-api.png
  width: 1200
  height: 630
---

What does a Site Reliability Engineer do for fun, you ask? We code and automate everything at work, so why not do it at home too!  It's one of the main reasons I insist on having everything I can on WiFi.

I spent a few days intercepting and reverse-engineering the communications protocol that my adjustable bed uses so that I could do away with the need to have it connect to a server in China.  My firewall blocks connections to and from China.  Neither the mobile app nor the bed communication is encrypted, making it somewhat simple to figure out what the network packets are doing and replay them.  I also added an HTTP API so I could integrate it with Siri Shortcuts. Now, I can tap one button (or issue a Siri command) that turns on the bedroom TV, turns off the bedroom lights, and puts the bed into a semi-sitting position. Then when we're ready for bed, I hit another button, and a series of automation steps are triggered to put the bed into the zero-g position, turn off all of the lights in the house, turn off the bedroom TV, and play some quiet music on my phone. After a few more minutes, my bed moves into my sleeping position.

In the morning, fifteen seconds after I hit snooze, the bed back moves into the zero-g position. Sixty seconds after turning off the alarm, the bed goes flat, and my office lights turn on.

I released the code and you can find it [here](https://github.com/trevorlauder/bn-adjustable-bed)
