import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function scrapeImages(query, size = 30) {
	const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(
		query
	)}&form=HDRSC2&first=1&tsc=ImageBasicHover`;

	try {
		const res = await fetch(searchUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64",
			},
		});

		const html = await res.text();
		const $ = cheerio.load(html);

		const imageUrls = [];
		//this is not my code
		$("a.iusc").each((_, el) => {
			try {
				const m = $(el).attr("m");
				if (m) {
					const json = JSON.parse(m);
					if (json.murl) {
						imageUrls.push(json.murl);
					}
				}
			} catch {}
		});
		return imageUrls.slice(0, size);
	} catch (err) {
		console.error("[IMAGE SCRAPER] Error fetching images:" + err);
		return [];
	}
}
