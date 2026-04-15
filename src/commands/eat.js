import between from "../utils/between.js";
export default {
	name: "eat",
	aliases: ["eated"],
	description: "eat oats",
	hidden: true,
	async execute(client, message, args) {
		if (args[0] === "oats") {
			let ranVal = between(0, 1);
			if (ranVal <= 0.2) await message.reply("mmm yum i love oats");
		}
	},
};
