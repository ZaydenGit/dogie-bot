import between from "../utils/between.js";
import { isElevated } from "../utils/permissions.js";
import { setWordOfTheDay } from "../utils/wordOfTheDay.js";
import { words } from "../utils/words.js";

export default {
	name: "wotd",
	description: "Allows user to set a new word of the day manually",
	aliases: ["wordoftheday", "setwotd", "changewotd"],
	hidden: true,
	async execute(client, message, args) {
		if (!isElevated(message.author.id)) return;
		if (args.length === 0) args = null;
		const wordOfTheDay = args ? String(args[0]) : String(words[Math.floor(between(0, words.length))]);
		await setWordOfTheDay(client, wordOfTheDay);
		message.reply(`Changed word of the day to "${wordOfTheDay}".`);
	},
};
