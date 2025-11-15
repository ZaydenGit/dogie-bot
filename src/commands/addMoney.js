import { addMoney } from "../services/moneyService.js";
import { parseUserAndAmount } from "../utils/commandParser.js";
import { isElevated } from "../utils/permissions.js";
export default {
	name: "addmoney",
	description: "add money to an account",
	aliases: ["addbalance", "add"],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return;
		const { targetUser, amount } = parseUserAndAmount(message, args);
		if (!isElevated(message.author.id)) return message.reply("cut that out");
		if (isNaN(amount)) return message.channel.send("Please provide a valid number of coins");

		const newUserBalance = await addMoney(targetUser.id, message.guild.id, parseInt(amount));
		return message.reply(
			`Successfully added ${amount} Dogie Coins to <@${targetUser.id}>'s account. Their balance is now ${newUserBalance} Dogie Coins.`
		);
	},
};
