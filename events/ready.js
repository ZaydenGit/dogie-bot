const { ActivityType } = require('discord.js')
const fs = require('fs')
const { client, words, between } = require('../index.js')
const cron = require('node-cron')
const path = require('path')

const ranWordPath = path.join(__dirname, '../data/ranWord.txt')

client.on('ready', () => {
	console.log(`[CLIENT] - Dogie Bot is now online!`)

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
})
