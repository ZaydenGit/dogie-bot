import Money from "../Schemas/money.js";
const cooldowns = new Map();
import { between } from "../utils/between.js";

export default {
	name: "funds",
	description: "Gives user a random amount of money between 2500 and 10000 provided the user has a low enough balance.",
	aliases: ["debtremediation", "getoutofdebtfree", "debt", "prostitute"],
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
		const cooldownTime = 60 * 1000; //15s
		const now = Date.now();
		const cmdLastUsed = cooldowns.get(message.author.id);
		if (cmdLastUsed && now - cmdLastUsed < cooldownTime) {
			const timeLeft = Math.ceil((cooldownTime - (now - cmdLastUsed)) / 1000);
			return message.reply(`You must wait ${timeLeft} second(s) before using this again.`);
		}
		cooldowns.set(message.author.id, now);
		let tip = Math.round(between(1, 4));
		switch (tip) {
			case 1:
				message.channel.send(`\<:saddogie:733838502155780165>. Dogie gives you ${tip * 2500}...`);
			case 2:
				message.channel.send(`\<:dogie:746903359071584337>. Dogie gives you ${tip * 2500} Coins`);
			case 3:
				message.channel.send(`\<:happydogie:733840389840306176>!. Dogie gives you ${tip * 2500} Coins`);
			case 4:
				message.channel.send(`\<:angeldogie:777888818019172382>!!!. Dogie gives you ${tip * 2500} Coins`);
		}
		moneySchema.money += tip * 2500;
		await moneySchema.save().catch((e) => console.log(e));
		setTimeout(() => cooldowns.delete(message.author.id), cooldownTime);
	},
};
