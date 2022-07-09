module.exports = {
	name: 'ping',
	aliases: ['pong', 'latency'],
	hidden: false,
	execute(client, message, args) {
		message.reply('Pinging').then((m) => {
			m.edit(`pong (${m.createdTimestamp - message.createdTimestamp}ms)`)
		})
	},
}
