import { ActivityType } from "discord.js";
import fs from "fs";
import { words } from "../utils/words.js";
import { between } from "../utils/between.js";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import pinCache from "../utils/pinCache.js";

const ranWordPath = path.join(__dirname, "../data/ranWord.txt");
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
		pinCache.cachePins(guild);

		if (!fs.existsSync(ranWordPath)) {
			fs.writeFileSync(ranWordPath, "");
			console.log("[INIT] ranWord.txt created");
		}

		let setWordOfTheDay = (ranWord) => {
			client.user.setPresence({
				activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
				status: "online",
			});
			fs.writeFileSync(ranWordPath, ranWord);
			console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`);
		};
		//run wordOfTheDay on startup
		const fileContents = fs.readFileSync(ranWordPath).toString().trim();
		setWordOfTheDay(fileContents ? fileContents : words[Math.round(between(0, words.length))]);

		cron.schedule(
			"0 0 * * *",
			() => {
				console.log(`[WOTD] Changing word of the day.`);
				const newWord = words[Math.round(between(0, words.length))];
				setWordOfTheDay(newWord);
			},
			{ schedule: true, timeZone: "America/Los_Angeles" }
		);

		_resolveReady();
		console.log(`[CLIENT] - Dogie Bot is now online!`);
	},
};
