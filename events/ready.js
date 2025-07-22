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

	wordOfTheDay = (ranWord) => {
		client.user.setPresence({
			activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
			status: 'online',
		})
		fs.writeFileSync(ranWordPath, ranWord)
		console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
	}
	//run wordOfTheDay on startup
	wordOfTheDay(fs.readFileSync(ranWordPath).toString() ? fs.readFileSync(ranWordPath).toString().toUpperCase() : words[between(1, words.length)])

	cron.schedule(
		'0 0 * * *',
		() => {
			wordOfTheDay(words[between(1, words.length)])
		},
		{ schedule: true, timeZone: 'America/Los_Angeles' }
	)
})
