import { removeMoney } from "../services/moneyService.js";
import { parseUserAndAmount } from "../utils/commandParser.js";
import { isElevated } from "../utils/permissions.js";
export default {
	name: "removemoney",
	description: "Removes money from a mentioned user's account.",
	aliases: ["removebalance", "delbalance", "delmoney", "remove"],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return;
		const { targetUser, amount } = parseUserAndAmount(message, args);
		if (!isElevated(message.author.id)) return message.reply("cut that out");
		if (isNaN(amount)) return message.channel.send("Please provide a amountid number of coins");

		const newUserBalance = await removeMoney(targetUser.id, message.guild.id, parseInt(amount));
		message.reply(
			`Successfully removed ${amount} Dogie Coins from <@${targetUser.id}>'s account. Their balance is now ${newUserBalance} Dogie Coins.`
		);
	},
};
