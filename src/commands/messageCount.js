import { getLevelData } from "../services/levelService.js";
import { getMessageSchema } from "../services/messageService.js";

export default {
	name: "messagecount",
	description: "Displays user's Message Count (out of total required according to level).",
	aliases: ["msgcount", "msgs", "mc"],
	hidden: false,
	async execute(client, message, args) {
		const [messageData, levelData] = await Promise.all([
			getMessageSchema(message.author.id),
			getLevelData(message.author.id, message.guild.id),
		]);
		const currentMessages = messageData.messages;
		const discount = levelData.msgDiscount;
		const requiredMessages = 50 - discount;

		return await message.reply(
			`You have ${currentMessages} messages out of ${requiredMessages} required to gain Dogie Coins. Your current discount is ${discount} messages.`
		);
	},
};
