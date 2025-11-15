import { getBalance, removeMoney, addMoney } from "../services/moneyService.js";
import { parseUserAndAmount } from "../utils/commandParser.js";
export default {
	name: "payuser",
	description: "User pays an amount of money to another mentioned number.",
	aliases: ["pay", "send"],
	hidden: false,
	async execute(client, message, args) {
		const { targetUser, amount: sentMoney } = parseUserAndAmount(message, args);

		if (isNaN(sentMoney)) return message.channel.send("Invalid number");
		if (Math.sign(sentMoney) === -1) return message.channel.send("You cannot send a negative amount of money.");
		if (sentMoney === 0) return message.channel.send("You cannot send zero money.");
		if (targetUser.id === message.author.id) return message.channel.send("You can't send money to yourself!");

		const userBalance = await getBalance(message.author.id, message.guild.id);
		if (userBalance < sentMoney) return message.channel.send("You cannot send more money than you have");

		const newUserBalance = await removeMoney(message.author.id, message.guild.id, parseInt(sentMoney));
		const newTargetBalance = await addMoney(targetUser.id, message.guild.id, parseInt(sentMoney));
		await message.channel.send(
			`Successfully sent ${sentMoney} to <@${targetUser.id}>. Their balance is now ${newTargetBalance}, and your balance is now ${newUserBalance}`
		);
	},
};
