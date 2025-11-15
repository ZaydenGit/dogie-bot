import { getBalance } from "../services/moneyService.js";

export default {
	name: "balance",
	description: "Displays User's Balance",
	aliases: ["bal", "money"],
	hidden: false,
	async execute(client, message, args) {
		if (message.guild === null) return;
		let targetUser = message.mentions.users.first();
		if (!targetUser) targetUser = message.author;

		const userBalance = await getBalance(targetUser.id, message.guild.id);
		if (userBalance === 0) return await message.reply("Broke. No Dogie Coins. >:(");
		if (targetUser.id === message.author.id) return await message.reply(`You have ${userBalance} Dogie Coins`);
		else return await message.reply(`<@${targetUser.id}>'s balance is ${userBalance}`);
	},
};
