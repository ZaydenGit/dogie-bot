import between from "../utils/between.js";
import { setWordOfTheDay } from "../utils/wordOfTheDay.js";
import { words } from "../utils/words.js";
import elevatedUsers from "../data/elevatedUsers.json" with { type: "json" };

export default {
	name: "wotd",
	description: "Allows user to set a new word of the day manually",
	aliases: ["wordoftheday", "setwotd", "changewotd"],
	hidden: true,
	async execute(client, message, args) {
		if (!elevatedUsers.includes(message.author.id)) return;
		const wordOfTheDay = args ? String(args[0]) : String(words[Math.floor(between(0, words.length))]);
		await setWordOfTheDay(client, wordOfTheDay);
		message.reply(`Changed word of the day to "${wordOfTheDay}".`);
	},
};
