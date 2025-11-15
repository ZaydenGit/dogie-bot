import { checkCooldown } from "../handlers/cooldownHandler.js";
import between from "../utils/between.js";
import addMoney from "./addMoney.js";
import config from "../../config.json" with { type: "json" };

const { cooldownMs, tipMultiplier, maxBalanceForFunds} = config.commands.funds;


export default {
	name: "funds",
	description: "Gives user a random amount of money between 2500 and 10000 provided the user has a low enough balance.",
	aliases: ["freemoney", "getoutofdebtfree", "debt", "prostitute"],
	hidden: false,
	async execute(client, message, args) {
		const currentBalance = await getBalance(message.author.id, message.guild.id);
		if (currentBalance > maxBalanceForFunds) return message.channel.send("You must be broke to use this command");

		const timeLeft = checkCooldown(this.name, message.author.id, cooldownMs);
		if (timeLeft > 0) {
			return message.reply(`You must wait ${timeLeft} second(s) before using this again.`);
		}

		const tip = Number(Math.round(between(1, 4)));
		const tipAmount = tip * tipMultiplier;
		switch (tip) {
			case 1:
				message.reply(`\<:saddogie:733838502155780165>. Dogie gives you ${tipAmount}...`);
				break;
			case 2:
				message.reply(`\<:dogie:746903359071584337>. Dogie gives you ${tipAmount} Coins`);
				break;
			case 3:
				message.reply(`\<:happydogie:733840389840306176>!. Dogie gives you ${tipAmount} Coins`);
				break;
			case 4:
				message.reply(`\<:angeldogie:777888818019172382>!!!. Dogie gives you ${tipAmount} Coins`);
				break;
		}
		addMoney(message.author.id, message.guild.id, tipAmount);
		setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_MS);
	},
};
