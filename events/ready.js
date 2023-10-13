const { ActivityType } = require('discord.js')
const client = require('../index.js').client
const ranWord = require('../index.js').ranWord
client.on('ready', () => {
	console.log(`[CLIENT] - Dogie Bot is now online!`)
	client.user.setPresence({
		activities: [{ name: `for the word ${ranWord.toUpperCase()}`, type: ActivityType.Watching }],
		status: 'online',
	})
	console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
})
