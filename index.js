//hi bl
const Discord = require('discord.js')
const client = new Discord.Client({ intents: [32767], allowedMentions: { parse: ['users', 'roles'] } })
const fs = require('fs')
require('dotenv').config()
client.login(process.env.TOKEN)

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.aliases = new Discord.Collection()
module.exports.client = client

// MONGODB
const mongo = require('mongoose')
mongo
	.connect(process.env.MONGOPASS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log(`[MONGOOSE] - Connected!`))

function between(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

// RANDOM DOGIE WORD
var words = fs.readFileSync('words.txt').toString()
words = words.split('\n')
module.exports.ranWord = words[between(1, words.length)]

// COMMAND HANDLER
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
	const pull = require(`./commands/${file}`)
	console.log(`[COMMAND] - ${file} is now loaded!`)
	client.commands.set(pull.name, pull)
	if (pull.aliases !== 0) {
		pull.aliases.forEach((alias) => client.commands.set(alias, pull))
	}
}

// EVENT HANDLER
fs.readdirSync('./events/').forEach((file) => {
	var jsFiles = fs.readdirSync('./events/').filter((f) => f.split('.').pop() === 'js')
	if (jsFiles.length <= 0) return console.log('[EVENT HANDLER] - Yet to be loaded or no available')

	jsFiles.forEach((file) => {
		const eventGet = require(`./events/${file}`)
		console.log(`[EVENT HANDLER] - ${file} is now loaded!`)
		try {
			client.events.set(eventGet.name, eventGet)
		} catch (error) {
			return console.log(error)
		}
	})
})
