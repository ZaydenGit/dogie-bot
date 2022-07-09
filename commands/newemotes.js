const Discord = require('discord.js')
const dogies = require('../dogies.json')
const dogielist = dogies.dogielist.filter(Boolean)
const blacklist = dogies.blacklist.filter(Boolean)
module.exports = {
	name: 'newemotes',
	description: 'show emotes that dogie bot does not have in its json',
	aliases: ['updateemotes', 'new', 'newdogies'],
	hidden: true,
	async execute(client, message, args) {
		if (!message.member.roles.cache.some((r) => r.name === 'Dogie Trainer')) return message.channel.send('You must have the Dogie Trainer role to use this command.')
		let embed = new Discord.MessageEmbed().setThumbnail(client.user.avatarURL)
		var newEmotes = []
		await message.guild.emojis.cache.map((emoji) => {
			if (emoji.animated) newEmotes.push(`<a:${emoji.name}:${emoji.id}>`)
			else newEmotes.push(`<:${emoji.name}:${emoji.id}>`)
		})
		newEmotes = newEmotes.filter((e) => !dogielist.includes(e) && !blacklist.includes(e))
		if (newEmotes.length > 0) {
			embed.setTitle(`Emotes not added to Dogie Bot (yet):`)
			embed.setColor('BLUE')
			newEmotes.forEach((entry) => {
				embed.addField(entry, `\\${entry}`)
			})
		} else {
			embed.setTitle(`No new emotes detected`)
			embed.setColor('GREEN')
		}
		message.channel.send(embed)
	},
}
