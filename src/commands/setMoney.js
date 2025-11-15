import { setMoney } from "../services/moneyService.js";
import { parseUserAndAmount } from "../utils/commandParser.js";
import { isElevated } from "../utils/permissions.js";
export default {
	name: "setmoney",
	description: "Sets a user's balance to specified amount.",
	aliases: ["set"],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return;
		if (!isElevated(message.author.id)) return message.reply("cut that out");
		const { targetUser, amount } = parseUserAndAmount(message, args);
		if (isNaN(amount)) return message.channel.send("Please provide a amountid number of coins");

		await setMoney(targetUser.id, message.guild.id, parseInt(amount));
		return message.reply(`Successfully set <@${targetUser.id}>'s balance to ${amount} Dogie Coins.`);
	},
};
