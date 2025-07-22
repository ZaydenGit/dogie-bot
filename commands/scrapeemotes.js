// const Discord = require('discord.js')
// const dogies = require('../dogies.json')
// const dogielist = dogies.dogielist.filter(Boolean)
// const blacklist = dogies.blacklist.filter(Boolean)
// module.exports = {
// 	name: 'updateemotes',
// 	description: 'show emotes that dogie bot does not have in its json',
// 	aliases: ['newemotes', 'new', 'newdogies'],
// 	hidden: true,
// 	async execute(client, message, args) {
// 		if (!message.member.roles.cache.some((r) => r.name === 'Dogie Trainer')) return message.channel.send('You must have the Dogie Trainer role to use this command.')
// 		let embed = new Discord.EmbedBuilder().setThumbnail(client.user.avatarURL())
// 		var newEmotes = []
// 		await message.guild.emojis.cache.map((emoji) => {
// 			if (emoji.animated) newEmotes.push(`<a:${emoji.name}:${emoji.id}>`)
// 			else newEmotes.push(`<:${emoji.name}:${emoji.id}>`)
// 		})
// 		newEmotes = newEmotes.filter((e) => !dogielist.includes(e) && !blacklist.includes(e))
// 		if (newEmotes.length > 0) {
// 			embed.setTitle(`Emotes not added to Dogie Bot (yet):`)
// 			embed.setColor('Blue')
// 			newEmotes.forEach((entry) => {
// 				embed.addFields([{ name: entry, value: `\\${entry}` }])
// 			})
// 		} else {
// 			embed.setTitle(`No new emotes detected`)
// 			embed.setColor('Green')
// 		}
// 		message.channel.send({ embeds: [embed] })
// 	},
// }

const elevatedUsers = require('../elevatedUsers.json')
const { EmbedBuilder } = require('discord.js')
const Emotes = require(`../Schemas/emote`)

module.exports = {
	name: 'scrapeemotes',
	description: 'Scrapes emotes and stores them in database',
	aliases: ['scrape', 'updateemotes', 'newemotes', 'newdogies', 'scrapedogies', 'updatedogies'],
	hidden: true,
	async execute(client, message, args) {
		if (!elevatedUsers.includes(message.author.id)) return message.reply('cut that out')
		const tempMessage = await message.reply('WAIT.')
		const emotes = message.guild.emojis.cache
		const emoteIDs = new Set(emotes.map((e) => e.id))
		let added = 0
		let removed = 0
		for (const [id, emoji] of emotes) {
			const exists = await Emotes.findOne({ id })
			if (!exists) {
				await Emotes.create({
					id: String(id),
					name: emoji.name,
					rarity: '',
					blacklisted: false,
				})
				added++
			}
		}

		const storedEmotes = await Emotes.find({})
		for (const emote of storedEmotes) {
			if (!emoteIDs.has(String(emote.id))) {
				await Emotes.deleteOne({ id: emote.id })
				removed++
			}
		}
		const total = await Emotes.countDocuments()
		const blacklisted = await Emotes.countDocuments({ blacklisted: true })
		const unblacklisted = total - blacklisted

		const embed = new EmbedBuilder()
			.setTitle('Dogie Scraper Results: ')
			.addFields({ name: 'New Emotes Added', value: `${added}`, inline: false }, { name: 'Deleted Emotes Removed', value: `${removed}`, inline: false }, { name: 'Total Emotes', value: `${total}`, inline: true }, { name: 'Blacklisted', value: `${blacklisted}`, inline: true }, { name: 'Unblacklisted', value: `${unblacklisted}`, inline: true })
			.setColor('Green')

		await tempMessage.edit({ content: null, embeds: [embed] })
	},
}
