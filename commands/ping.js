module.exports = {
	name: 'ping',
	aliases: ['pong', 'latency'],
	hidden: false,
	async execute(client, message, args) {
		await message.reply('Pinging').then(async (m) => {
			await m.edit(`pong (${m.createdTimestamp - message.createdTimestamp}ms)`)
		})
	},
}
