module.exports = {
	name: 'say',
	description: 'Makes Dogie say something for you.',
	aliases: ['speak', 'echo'],
	hidden: false,
	async execute(client, message, args) {
		console.log(`dogie say "${args.join(' ')}" (${message.member.user.tag})`)
		client.channels
			.fetch('812344773448433694')
			.then(async (channel) => await channel.send(`dogie say "${args.join(' ')}" (${message.member.user.tag}) (#${message.channel.name} in ${message.guild.name})`))
			.catch(console.error)
		if (message.deletable) await message.delete()
		if (args.length < 1) return await message.reply('TELL ME SOMETHING TO SAY')
		await message.channel.send(args.join(' '))
	},
}
