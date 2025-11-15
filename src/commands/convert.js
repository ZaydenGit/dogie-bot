import sendTempMessage from "../utils/sendTempMessage.js";
import { getBalance, removeMoney } from "../services/moneyService.js";
import { addXp, getLevelData } from "../services/levelService.js";

export default {
	name: "convert",
	description: "Converts an amount of money (or all of it) to XP.",
	aliases: ["transfer"],
	hidden: false,
	async execute(client, message, args) {
		if (!args[0]) return sendTempMessage("Please specify the amount of Dogie Coins to convert to xp.");
		if ((args[0] !== "all" && isNaN(args[0])) || args[0] <= 0)
			return sendTempMessage("Please enter a valid positive number or use 'all'.", message);

		const currentBalance = await getBalance(message.author.id, message.guild.id);
		let amountToConvert = args[0] === "all" || args[0] === "a" ? currentBalance : Math.floor(parseInt(args[0]));

		if (amountToConvert > currentBalance)
			return sendTempMessage("You do not have enough Dogie Coins to convert.", message);

		await removeMoney(message.author.id, message.guild.id, amountToConvert);
		const levelResult = await addXp(message.author.id, message.guild.id, amountToConvert);

		if (levelResult.discountIncreased) {
			message.reply(
				`You just gained a discount in messages needed to earn Dogie Coins! Current: ${levelResult.newDiscount}`
			);
		}

		const newLevelData = await getLevelData(message.author.id, message.guild.id);
		const newUserBalance = currentBalance - amountToConvert;

		await message.reply(
			`You converted ${amountToConvert} Dogie Coins into XP ${
				levelResult.newLevel > levelResult.oldLevel ? `and leveled up to **${newLevelData.level}**! ` : ""
			}(${newLevelData.xp - newLevelData.currentLevelXp}/${Math.round(
				newLevelData.nextLevelXp - newLevelData.currentLevelXp
			)} XP). You now have ${newUserBalance} Dogie Coins.`
		);
	},
};
