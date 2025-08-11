import Money from "../Schemas/money.js";
import Levels from "../Schemas/level.js";
import sendTempMessage from "../utils/sendTempMessage.js";

export default {
	name: "convert",
	description: "Converts an amount of money (or all of it) to XP.",
	aliases: ["transfer"],
	hidden: false,
	async execute(client, message, args) {
		if (!args[0]) return sendTempMessage("Please specify the amount of Dogie Coins to convert to xp.");
		if ((args[0] !== "all" && isNaN(args[0])) || Math.sign(args[0]) === -1)
			return sendTempMessage("Please enter a valid positive number or use 'all'.", message);

		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		});
		if (!moneySchema)
			moneySchema = await new Money({ userId: message.author.id, serverId: message.guild.id, money: 0 })
				.save()
				.catch((e) => console.log(e));

		let amountToConvert = args[0] === "all" || args[0] === "a" ? moneySchema.money : Math.floor(parseInt(args[0]));
		let levelSchema = await Levels.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		});
		if (amountToConvert > moneySchema.money)
			return sendTempMessage("You do not have enough Dogie Coins to convert.", message);
		if (!levelSchema)
			levelSchema = await new Levels({
				userId: message.author.id,
				serverId: message.guild.id,
				xp: 0,
				shopDiscount: 0,
				msgDiscount: 0,
			})
				.save()
				.catch((e) => console.log(e));

		moneySchema.money -= amountToConvert;
		levelSchema.xp += amountToConvert;

		const prevLevel = Math.floor(Math.cbrt((levelSchema.xp - amountToConvert) / 1.25));
		const newLevel = Math.floor(Math.cbrt(levelSchema.xp / 1.25));

		if (Math.floor(newLevel / 10) > levelSchema.msgDiscount && levelSchema.msgDiscount < 25) {
			levelSchema.msgDiscount = newLevel > 250 ? 25 : Math.floor(newLevel / 10);
			message.reply(
				`You just gained a discount in messages needed to earn Dogie Coins! Current: ${levelSchema.msgDiscount}`
			);
		}

		await Promise.all([moneySchema.save().catch(console.error), levelSchema.save().catch(console.error)]);

		if (newLevel > prevLevel)
			message.reply(
				`You converted ${amountToConvert} Dogie Coins into XP and leveled up to **${newLevel}**! ` +
					`(${Math.round(levelSchema.xp - 1.25 * newLevel ** 3)}/${Math.round(
						1.25 * (newLevel + 1) ** 3 - 1.25 * newLevel ** 3
					)} XP) ` +
					`You now have ${moneySchema.money} Dogie Coins.`
			);
		else
			message.reply(
				`You converted ${amountToConvert} Dogie Coins into XP. ` +
					`(${Math.round(levelSchema.xp - 1.25 * newLevel ** 3)}/${Math.round(
						1.25 * (newLevel + 1) ** 3 - 1.25 * newLevel ** 3
					)} XP) ` +
					`You now have ${moneySchema.money} Dogie Coins.`
			);
	},
};
