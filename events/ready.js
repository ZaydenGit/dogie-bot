const { ChannelType, ActivityType } = require('discord.js')
const fs = require('fs')
const { client, words, between } = require('../index.js')
const cron = require('node-cron')
const path = require('path')
const pinCache = require('../data/pinCache.js')

const ranWordPath = path.join(__dirname, '../data/ranWord.txt')

client.on('ready', async () => {
	// cache pins on startup

	const guild = client.guilds.cache.first()
	console.log('[PINS CACHE] Fetching pins in guild ' + guild.name)
	let totalCachedPins = 0
	let totalCachedChannels = 0
	for (const [_, channel] of guild.channels.cache) {
		if (![ChannelType.GuildText, ChannelType.GuildAnnouncment].includes(channel.type)) continue
		try {
			const pins = await channel.messages.fetchPinned()
			await pinCache.setPins(channel.id, pins)
			totalCachedPins += pins.size
			totalCachedChannels++
			process.stdout.write(`\r${' '.repeat(100)}\r[PINS CACHE] Cached pins from #${channel.name}.`)
		} catch (err) {
			if (err.message === 'Missing Access') continue
			console.error(`[PINS CACHE] Failed to cache #${channel.name}:`, err.message)
		}
	}
	process.stdout.write(`\r${' '.repeat(100)}\r[PINS CACHE] Cached ${totalCachedPins} pins from ${totalCachedChannels} channels.\n`)

	if (!fs.existsSync(ranWordPath)) {
		fs.writeFileSync(ranWordPath, '')
		console.log('[INIT] ranWord.txt created')
	}

	setWordOfTheDay = (ranWord) => {
		client.user.setPresence({
			activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
			status: 'online',
		})
		fs.writeFileSync(ranWordPath, ranWord)
		console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
	}
	//run wordOfTheDay on startup
	const fileContents = fs.readFileSync(ranWordPath).toString().trim()
	setWordOfTheDay(fileContents ? fileContents : words[Math.round(between(0, words.length))])

	cron.schedule(
		'0 0 * * *',
		() => {
			console.log(`[WOTD] Changing word of the day.`)
			const newWord = words[Math.round(between(0, words.length))]
			setWordOfTheDay(newWord)
		},
		{ schedule: true, timeZone: 'America/Los_Angeles' }
	)

	console.log(`[CLIENT] - Dogie Bot is now online!`)
})
