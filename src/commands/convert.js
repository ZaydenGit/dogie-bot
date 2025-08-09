import Money from "../Schemas/money.js";
import Levels from "../Schemas/level.js";
export default {
	name: "convert",
	description: "Converts an amount of money (or all of it) to XP.",
	aliases: ["transfer"],
	hidden: false,
	async execute(client, message, args) {
		if (args[0] !== "all" && isNaN(args[0]))
			return message.channel.send("You must specify an amount of money that you want to convert to XP").then((msg) => {
				setTimeout(() => msg.delete(), 5000);
			});
		// args[0] = Math.floor(parseInt(args[0])).toFixed()
		if (args[0] !== "all" && Math.sign(args[0]) === -1)
			return message.channel.send("You cannot convert a negative amount of money.").then((msg) => {
				setTimeout(() => msg.delete(), 5000);
			});
		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		});
		if (!moneySchema)
			moneySchema = await new Money({ userID: message.author.id, serverID: message.guild.id, moneySchema: 0 })
				.save()
				.catch((e) => console.log(e));
		if (args[0] === "all" || args[0] === "a") arg = moneySchema.money;
		else arg = Math.floor(parseInt(args[0])).toFixed();
		let levelSchema = await Levels.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		});
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
		if (arg > moneySchema.money)
			return message.channel.send("You do not have enough money to perform this action").then((msg) => {
				setTimeout(() => msg.delete(), 5000);
			});

		moneySchema.money = moneySchema.money - parseInt(arg);
		moneySchema.save().catch((e) => console.log(e));

		levelSchema.xp = levelSchema.xp + parseInt(arg);

		const level = Math.floor(Math.cbrt(levelSchema.xp / 1.25));
		if (Math.floor(level / 10) > levelSchema.msgDiscount && levelSchema.msgDiscount < 25) {
			if (level < 10) return;
			if (level <= 250) levelSchema.msgDiscount = Math.floor(level / 10);
			else if (level > 250) levelSchema.msgDiscount = 25;
			message.reply(
				`You just gained a discount in messages needed to earn Dogie Coins! Current: ${levelSchema.msgDiscount}`
			);
		}
		await levelSchema.save().catch((e) => console.log(e));
		if (level > Math.floor(Math.cbrt((levelSchema.xp - arg) / 1.25)))
			return message.reply(
				`You have converted ${arg} Dogie Coins into XP and levelled up to ${level}! (${
					levelSchema.xp - 1.25 * level ** 3
				}/${1.25 * (level + 1) ** 3 - 1.25 * level ** 3}). You now have ${moneySchema.money} Dogie Coins`
			);
		else
			return message.reply(
				`You have converted ${arg} Dogie Coins into XP (${levelSchema.xp - 1.25 * level ** 3}/${
					1.25 * (level + 1) ** 3 - 1.25 * level ** 3
				}). You now have ${moneySchema.money} Dogie Coins`
			);
	},
};
