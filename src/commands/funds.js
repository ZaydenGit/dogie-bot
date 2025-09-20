import Money from "../Schemas/money.js";
import between from "../utils/between.js";

const cooldowns = new Map();
const COOLDOWN_MS = 30000;
const TIP_MULT = 2500;

export default {
	name: "funds",
	description: "Gives user a random amount of money between 2500 and 10000 provided the user has a low enough balance.",
	aliases: ["freemoney", "getoutofdebtfree", "debt", "prostitute"],
	hidden: false,
	async execute(client, message, args) {
		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		});
		if (!moneySchema) {
			moneySchema = new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: 0,
			});
			await moneySchema.save().catch((e) => console.log(e));
		}
		if (moneySchema.money > 5000) return message.channel.send("You must be broke to use this command");
		//cd
		const now = Date.now();
		const cmdLastUsed = cooldowns.get(message.author.id);
		if (cmdLastUsed && now - cmdLastUsed < COOLDOWN_MS) {
			const timeLeft = Math.ceil((COOLDOWN_MS - (now - cmdLastUsed)) / 1000);
			return message.reply(`You must wait ${timeLeft} second(s) before using this again.`);
		}
		cooldowns.set(message.author.id, now);
		const tip = Number(Math.round(between(1, 4)));
		switch (tip) {
			case 1:
				message.reply(`\<:saddogie:733838502155780165>. Dogie gives you ${tip * TIP_MULT}...`);
				break;
			case 2:
				message.reply(`\<:dogie:746903359071584337>. Dogie gives you ${tip * TIP_MULT} Coins`);
				break;
			case 3:
				message.reply(`\<:happydogie:733840389840306176>!. Dogie gives you ${tip * TIP_MULT} Coins`);
				break;
			case 4:
				message.reply(`\<:angeldogie:777888818019172382>!!!. Dogie gives you ${tip * TIP_MULT} Coins`);
				break;
		}
		moneySchema.money += tip * TIP_MULT;
		await moneySchema.save().catch((e) => console.log(e));
		setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_MS);
	},
};
