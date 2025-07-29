const { between } = require('../index.js')
const { ChannelType } = require('discord.js')
module.exports = {
	name: 'ratepins',
	aliases: ['pins', 'tierlist'],
	hidden: false,
	async execute(client, message, args) {
		const pinsList = []
		if (args.length === 0) {
			const guild = client.guilds.cache.get(message.guild.id)
			for (const [_, channel] of guild.channels.cache) {
				if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncment) {
					try {
						const cachedPins = await channel.messages.fetchPinned()
						cachedPins.forEach((msg) => pinsList.push(msg))
					} catch (err) {
						if (err.message === 'Missing Access') return
						console.error(`Couldn't fetch pinned messages in ${channel.name}:`, err.message)
					}
				}
			}
		} else {
			try {
				const cachedPins = await message.mentions.channels.first().messages.fetchPinned()
				cachedPins.forEach((msg) => pinsList.push(msg))
			} catch (err) {
				console.error(`Couldn't fetch pinned messages in ${args[0]}:`, err.message)
			}
		}
		const randomPin = pinsList[Math.round(between(0, pinsList.length))]
		return randomPin.forward(message.channel.id).then((msg) => msg.reply(`${randomPin.createdTimestamp % 11}/10`))
	},
}
