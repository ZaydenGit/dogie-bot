const { ActivityType } = require('discord.js')
const client = require('../index.js').client
const fs = require('fs')
const words = require('../index.js').words

const cron = require('node-cron')
client.on('ready', () => {
	console.log(`[CLIENT] - Dogie Bot is now online!`)
	function between(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
	wordOfTheDay = (ranWord) => {
		client.user.setPresence({
			activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
			status: 'online',
		})
		fs.writeFileSync('./ranWord.txt', ranWord)
		console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
	}
	//run wordOfTheDay on startup
	wordOfTheDay(fs.readFileSync('./ranWord.txt').toString() ? fs.readFileSync('./ranWord.txt').toString().toUpperCase() : words[between(1, words.length)])

	cron.schedule(
		'0 0 * * *',
		() => {
			wordOfTheDay(words[between(1, words.length)])
		},
		{ schedule: true, timeZone: 'America/Los_Angeles' }
	)
})
