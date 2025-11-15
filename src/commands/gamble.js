import { getBalance, addMoney, removeMoney } from "../services/moneyService.js";
import between from "../utils/between.js";
import { checkCooldown } from "../handlers/cooldownHandler.js";
import config from "../../config.json" with { type: "json" };

const {
	cooldownMs,
	maxGamble,
	jackpotRoll,
	winRoll,
	bigBallerMessages
} = config.commands.gamble;

const parseGambleAmount = (args, currentBalance) => {
	const gambleArg = args[0];

	if (!gambleArg) {
		return { amount: 0, error: "Please specify an amount to gamble." };
	}

	let amount;
	if (gambleArg.toLowerCase() === "all") {
		amount = currentBalance;
	} else {
		if (isNaN(gambleArg)) {
			return { amount: 0, error: "Please send a valid number." };
		}
		amount = Math.floor(parseInt(gambleArg));
	}

	if (amount <= 0) {
		return { amount: 0, error: "You cannot gamble negative money or zero." };
	}
	if (currentBalance < amount) {
		return { amount: 0, error: "You do not have enough money." };
	}
	if (amount > maxGamble && gambleArg.toLowerCase() !== "all") {
		return { amount: 0, error: `You cannot gamble more than ${maxGamble} Dogie Coins at a time (unless you go 'all in').` };
	}

	return { amount: amount, error: null };
}

const calculateGambleResult = (gambleAmount, roll) =>{
	if (roll >= jackpotRoll) {
		const jackpotMultiplier = between(0, 1).toFixed(1) >= 0.9 ? 20 : 5;
		const winnings = gambleAmount * jackpotMultiplier;
		const jackpotType = jackpotMultiplier === 20 ? "MEGA JACKPOT" : "JACKPOT";
		return {
			winnings: winnings,
			reply: `You won the ${jackpotType} of ${winnings} Dogie Coins!`,
		};
	}

	if (roll > winRoll) {
		const winnings = Math.round(gambleAmount * between(0.25, 1.5));
		return {
			winnings: winnings,
			reply: `You won ${winnings} Dogie Coins! ${winnings / gambleAmount > 1 ? "High roll! " : ""}`,
		};
	}

	const losses = Math.round(gambleAmount * between(0.25, 1));
	return {
		winnings: -losses,
		reply: `You lost ${losses} Dogie Coins.`,
	};
}

export default {
	name: "gamble",
	description: `User gambles an amount of money not exceeding ${maxGamble} or all of it.`,
	aliases: ["invest"],
	hidden: false,
	async execute(client, message, args) {
	
		const timeLeft = checkCooldown(this.name, message.author.id, cooldownMs);
		if (timeLeft > 0) {
			const msg = (between(0, 1) > 0.98)
				? `Due to complaints and an ongoing investigation from a certain federal bureau you must wait ${timeLeft} seconds before gambling again.`
				: `You must wait ${timeLeft} second(s) before using this again.`;
			return message.reply(msg);
		}

		const currentBalance = await getBalance(message.author.id, message.guild.id);
		const { amount, error } = parseGambleAmount(args, currentBalance);

		if (error) {
			return message.reply(error);
		}

		if (args[0].toLowerCase() === "all" && amount > 0) {
			const randomMsg = bigBallerMessages[Math.floor(between(0, bigBallerMessages.length))];
			message.reply(randomMsg);
		}

		const roll = Number(between(0, 1).toFixed(2));
		const { winnings, reply } = calculateGambleResult(amount, roll);

		let newBalance;
		let replySuffix;
		
		if (winnings > 0) {
			newBalance = await addMoney(message.author.id, message.guild.id, winnings);
			replySuffix = `You now have ${newBalance} Dogie Coins.`;
		} else {
			newBalance = await removeMoney(message.author.id, message.guild.id, Math.abs(winnings));
			replySuffix = `${newBalance < 0 ? "You are now in debt!" : ""} You now have ${newBalance} Dogie Coins.`;
		}

		message.reply(`${reply} ${replySuffix}`);
	},
};