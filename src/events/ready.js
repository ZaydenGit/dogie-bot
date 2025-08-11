import { words } from "../utils/words.js";
import { between } from "../utils/between.js";
import cron from "node-cron";
import pinCache from "../utils/pinCache.js";
import { getWordOfTheDay, setWordOfTheDay } from "../utils/wordOfTheDay.js";
import { scrapeImages } from "../utils/imageScraper.js";

export let isReady;

export default {
	name: "ready",
	once: true,
	async execute(client) {
		// cache pins on startup
		let _resolveReady;
		isReady = new Promise((resolve) => {
			_resolveReady = resolve;
		});

		const guild = client.guilds.cache.first();
		await pinCache.cachePins(guild);

		const orcaImages = await scrapeImages("orca");
		console.log(`[IMAGE SCRAPER] Retrieved ${orcaImages.length} images of orcas.`);
		client.orcaImages = orcaImages;

		//run setWordOfTheDay on startup
		await setWordOfTheDay(client, getWordOfTheDay() ? getWordOfTheDay() : words[Math.round(between(0, words.length))]);

		await cron.schedule(
			"0 0 * * *",
			async () => {
				console.log(`[WOTD] Changing word of the day.`);
				await setWordOfTheDay(words[Math.round(between(0, words.length))]);
			},
			{ schedule: true, timezone: "America/Los_Angeles" }
		);

		_resolveReady();
		console.log(`[CLIENT] - Dogie Bot is now online!`);
	},
};
