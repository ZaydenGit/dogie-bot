import Levels from "../Schemas/level.js";

export default {
	name: "level",
	description: "Displays user's level and XP needed to level up.",
	aliases: ["xp", "lvl"],
	hidden: false,
	async execute(client, message, args) {
		let levelSchema = await Levels.findOne({ userId: message.author.id, serverId: message.guild.id });
		if (!levelSchema)
			levelSchema = await new Levels({
				userId: message.author.id,
				xp: 0,
				shopDiscount: 0,
				msgDiscount: 0,
				serverId: message.guild.id,
			})
				.save()
				.catch((e) => console.log(e));
		level = Math.floor(Math.cbrt(levelSchema.xp / 1.25));
		if (Math.floor(level / 10) > levelSchema.msgDiscount && levelSchema.msgDiscount < 25) {
			if (level < 10) return;
			if (level <= 250) levelSchema.msgDiscount = Math.floor(level / 10);
			else if (level > 250) levelSchema.msgDiscount = 25;
			await levelSchema.save().catch((e) => console.log(e));
			message.reply(
				`You just gained a discount in messages needed to earn Dogie Coins! Current: ${levelSchema.msgDiscount}`
			);
		}
		await message.channel.send(
			`**Level: ${Math.floor(Math.cbrt(levelSchema.xp / 1.25))}** (**${Math.floor(
				levelSchema.xp - 1.25 * level ** 3
			)}**\/**${Math.ceil(1.25 * (level + 1) ** 3 - 1.25 * level ** 3)}**)`
		);
	},
};
