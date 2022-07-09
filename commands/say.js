module.exports = {
	name: 'say',
	description: 'make dogie speak for you',
	aliases: ['speak', 'echo', 'send'],
	hidden: false,
	execute(client, message, args) {
		console.log(`dogie say "${args.join(' ')}" (${message.member.user.tag})`)
		client.channels
			.fetch('812344773448433694')
			.then((channel) => channel.send(`dogie say "${args.join(' ')}" (${message.member.user.tag}) (#${message.channel.name} in ${message.guild.name})`))
			.catch(console.error)
		if (message.deletable) message.delete()
		if (args.length < 1) return message.reply('TELL ME SOMETHING TO SAY BITCH')
		message.channel.send(args.join(' '))
	},
}
