import { ActivityType } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ranWordPath = path.join(__dirname, "../data/ranWord.txt");

export function getWordOfTheDay() {
	if (!fs.existsSync(ranWordPath)) {
		fs.writeFileSync(ranWordPath, "");
		console.log("[INIT] ranWord.txt created");
	}
	return fs.readFileSync(ranWordPath).toString().trim();
}
export function setWordOfTheDay(client, wordOfTheDay) {
	if (!fs.existsSync(ranWordPath)) {
		fs.writeFileSync(ranWordPath, "");
		console.log("[INIT] ranWord.txt created");
	}
	client.user.setPresence({
		activities: [{ name: `for the word ${wordOfTheDay.toUpperCase()}`, type: ActivityType.Watching }],
		status: "online",
	});
	fs.writeFileSync(ranWordPath, wordOfTheDay);
	console.log(`[RANDOM WORD] : ${wordOfTheDay.toUpperCase()}`);
}
