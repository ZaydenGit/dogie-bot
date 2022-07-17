const client = require('../index.js').client
const ranWord = require('../index.js').ranWord
client.on('ready', () => {
	console.log(`[CLIENT] - Dogie Bot is now online!`)
	client.user.setActivity(`for the word ${ranWord.toUpperCase()}`, { type: 'WATCHING' })
	console.log(`[RANDOM WORD] : ${ranWord.toUpperCase()}`)
})
