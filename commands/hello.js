module.exports = {
	name: 'hello',
	aliases: ['hi'],
	description: 'hi dogie',
	hidden: false,
	execute(client, message, args) {
		message.react('746903359071584337')
		message.reply('<:dogie:746903359071584337> hi')
	},
}
