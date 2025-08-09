import Messages from "../Schemas/messages.js";
import Levels from "../Schemas/level.js";

export default {
	name: "messagecount",
	description: "Displays user's Message Count (out of total required according to level).",
	aliases: ["msgcount", "msgs", "mc"],
	hidden: false,
	async execute(client, message, args) {
		let levelSchema = await Levels.findOne({ userId: message.author.id });
		if (!levelSchema)
			levelSchema = await new Levels({
				userId: message.author.id,
				xp: 0,
				shopDiscount: 0,
				msgDiscount: 0,
			})
				.save()
				.catch((err) => console.log(err));
		let messageSchema = await Messages.findOne({ userId: message.author.id });
		if (!messageSchema) {
			messageSchema = new Messages({ userId: message.author.id, messages: 0 });
			await messageSchema.save().catch((err) => console.log(err));
		}
		return await message.reply(
			`You have ${messageSchema.messages} messages out of ${
				50 - levelSchema.msgDiscount
			} required to gain Dogie Coins. Your current discount is ${levelSchema.msgDiscount}`
		);
	},
};
