module.exports = {
	name: 'sex',
	description: 'sex',
	aliases: ['intercourse'],
	hidden: false,
	async execute(client, message, args) {
		message.channel.send('sex')
	},
}
