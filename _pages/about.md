---
permalink: /about/
title: About
---

<blockquote id="about-random-quote">
	<p></p>
</blockquote>
<script>
	(function(){
		try {
			var data = {{ site.data.quotes | jsonify }};
			if(!Array.isArray(data) || !data.length) return;
			var idx = Math.floor(Math.random() * data.length);
			var q = data[idx];
			if(typeof q !== 'string' || !q.length) return;
			var el = document.getElementById('about-random-quote');
			if(!el) return;
			var hQuote = String(q).replace(/&/g,'&amp;').replace(/</g,'&lt;');
			el.innerHTML = '<p>'+ hQuote +'</p>';
		} catch(e) {}
	})();
</script>

**Trevor Lauder** is a seasoned SRE/DevOps Engineer based in Sylvan Lake, Alberta, Canada, with over two decades of experience in designing, implementing, and maintaining reliable, scalable, and efficient systems. Throughout his career, he has held senior technical positions including Systems Administrator, Staff Systems Engineer, Principal Application Operations Engineer, Senior Site Reliability Engineer, and Senior Development Operations Engineer.

Trevor has contributed his expertise to leading organizations such as [Jobber](https://www.getjobber.com), [Guestlogix](https://www.guestlogix.com), [SkipTheDishes](https://www.skipthedishes.com), [Intuit](https://www.intuit.com/ca/), [TELUS](https://www.telus.com), [LAN Solutions](https://www.lansolutions.ca), Wireless Networks Inc., and [Lethbridge College](https://lethbridgecollege.ca). He is currently employed as a Senior Site Reliability Engineer at [Jobber](https://www.getjobber.com).

Outside of work, Trevor is passionate about automation at home and enjoys photography, astronomy, and spending time immersed in nature.
