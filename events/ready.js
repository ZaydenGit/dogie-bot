const { ActivityType } = require('discord.js')
const client = require('../index.js').client
const fs = require('fs')
const words = require('../index.js').words

// const { CronJob } = require('cron')
const cron = require('node-cron')
client.on('ready', () => {
	console.log(`[CLIENT] - Dogie Bot is now online!`)
	function between(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
	swaws = (ranWord) => {
		client.user.setPresence({
			activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
			status: 'online',
		})
		fs.writeFileSync('./ranWord.txt', ranWord)
		console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
	}
	if (!fs.readFileSync('./ranWord.txt').toString()) {
		swaws(words[between(1, words.length)])
	} else {
		console.log(`[RANDOM WORD] : ${fs.readFileSync('./ranWord.txt').toString().toUpperCase()}`)
	}

	cron.schedule(
		'* * * 1 * *',
		() => {
			// var words = fs.readFileSync('words.txt').toString()
			// words = words.split('\n')
			// ranWord = words[between(1, words.length)]
			swaws(words[between(1, words.length)])
		},
		{ schedule: true, timeZone: 'America/Los_Angeles' }
	)
})

// var words = fs.readFileSync('words.txt').toString()
// 			words = words.split('\n')
// 			ranWord = words[between(1, words.length)]
// 			client.user.setPresence({
// 				activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
// 				status: 'online',
// 			})
// 			console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
