const elevatedUsers = require('../data/elevatedUsers.json')
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
