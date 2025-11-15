import { addMoney } from "../services/moneyService.js";
import { incrementMessageCount } from "../services/messageService.js";
import sendTempMessage from "../utils/sendTempMessage.js";

export const runMessageCounter = async (message) => {
	try {
		const countRes = await incrementMessageCount(message.author.id, message.guild.id);
		if (countRes && countRes.dogieSpawn) {
			const { name, value, isMonday } = countRes.dogieSpawn;
			await addMoney(message.author.id, message.guild.id, value);
			const mondayMessage = isMonday
				? `a boosted ${value} Dogie Coins! Happy Dogie Monday!!!!!`
				: `${value} Dogie Coins`;
			sendTempMessage(`<@${message.author.id}> You found a ${name} ! It's worth ${mondayMessage}`, message);
		}
	} catch (e) {
		console.error(e);
	}
};
