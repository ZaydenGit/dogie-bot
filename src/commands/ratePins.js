import pinCache from "../utils/pinCache.js";

export default {
	name: "ratepins",
	aliases: ["pinreview", "tierlist"],
	description: "Rates a random pin in the server or a specified channel.",
	hidden: false,
	async execute(client, message, args) {
		const randomPin = await pinCache.getRandomPin(message.mentions.channels.first());
		const randomPinMsg = await message.guild.channels.cache
			.get(randomPin.channelId)
			.messages.fetch(randomPin.messageId);
		return await randomPinMsg
			.forward(message.channel.id)
			.then((msg) => msg.reply(`${randomPinMsg.createdTimestamp % 11}/10`));
	},
};
