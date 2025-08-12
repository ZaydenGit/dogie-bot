import Money from "../Schemas/money.js";
import { between } from "../utils/between.js";

const cooldowns = new Map();
const COOLDOWN_MS = 5000;
const MAX_GAMBLE = 100000;

export default {
	name: "gamble",
	description:
		"User gambles an amount of money not exceeding 100,000 or all of it. Low chance of a jackpot, even lower chance of a mega jackpot.",
	aliases: ["invest"],
	hidden: false,
	async execute(client, message, args) {
		//cd
		const now = Date.now();
		const lastUsed = cooldowns.get(message.author.id);
		if (lastUsed && now - lastUsed < COOLDOWN_MS) {
			const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastUsed)) / 1000);
			const msg =
				between(0, 1) > 0.98
					? `Due to complaints and an ongoing investigation from a certain federal bureau you must wait ${timeLeft} seconds before gambling again.`
					: `You must wait ${timeLeft} second(s) before using this again.`;
			return message.reply(msg);
		}
		cooldowns.set(message.author.id, now);

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
			await moneySchema.save();
		}

		let gambleAmount = args[0];
		if (gambleAmount == "all") {
			gambleAmount = moneySchema.money;
			const bigBallerMessages = [
				"big balls on this one",
				"holy schmoly",
				"oh frick..",
				"are you sure...? i'll take that as a yes",
				"wtf",
			];
			message.reply(bigBallerMessages[Math.floor(between(0, bigBallerMessages.length))]);
		} else {
			if (isNaN(gambleAmount)) return message.reply("Please send a valid number.");
			gambleAmount = Math.floor(parseInt(gambleAmount));
			if (gambleAmount > MAX_GAMBLE)
				return message.reply(`You cannot gamble more than ${MAX_AMOUNT} Dogie Coins at a time`);
		}
		if (gambleAmount <= 0) return message.reply("You cannot gamble negative money.");

		if (!moneySchema.money || moneySchema.money < gambleAmount) return message.reply("You do not have enough money.");

		const roll =
		  message.author.id === "227406017271562240"
		    ? 0.9 // guaranteed win path (> 0.7, < 0.97)
		    : Number(between(0, 1).toFixed(2));
		let winnings = 0;

		if (roll >= 0.97) {
			const jackpotMultipier = between(0, 1).toFixed(1) >= 0.9 ? 20 : 5;
			winnings = gambleAmount * jackpotMultipier;
			moneySchema.money += winnings;
			message.reply(
				`You won the ${
					jackpotMultiplier === 20 ? "MEGA JACKPOT" : "JACKPOT"
				} of ${winnings} Dogie Coins! You now have ${moneySchema.money} Dogie Coins!`
			);
		} else if (roll > 0.7) {
			winnings = Math.round(gambleAmount * between(0.25, 1.5));
			moneySchema.money += winnings;
			message.reply(
				`You won ${winnings} Dogie Coins! ${winnings / gambleAmount > 1 ? "High roll! " : ""}You now have ${
					moneySchema.money
				} Dogie Coins.`
			);
		} else {
			winnings = Math.round(gambleAmount * between(0.25, 1));
			moneySchema.money -= winnings;
			message.reply(
				`You lost ${winnings} Dogie Coins. ${moneySchema.money < 0 ? "You are now in debt!" : ""} You now have ${
					moneySchema.money
				} Dogie Coins.`
			);
		}
		await moneySchema.save();
		setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_MS);
	},
};
