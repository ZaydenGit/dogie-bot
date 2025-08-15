import between from "../utils/between.js";
export default {
	name: "funny",
	description: "The funny",
	aliases: ["funny"],
	hidden: false,
	async execute(client, message, args) {
		ranVal = between(0, 1);
		if (ranVal <= 0.22) message.reply("lol");
		if (ranVal > 0.22 && ranVal <= 0.66) message.reply("rofl");
		if (ranVal > 0.66 && ranVal <= 0.98) message.reply("trololol");
		if (ranVal > 0.98) message.reply("kek");
	},
};
