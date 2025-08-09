export default {
	name: "ping",
	aliases: ["pong", "latency"],
	description: "Ping",
	hidden: false,
	async execute(client, message, args) {
		await message.reply("Pinging").then(async (m) => {
			await m.edit(`pong (${m.createdTimestamp - message.createdTimestamp}ms)`);
		});
	},
};
