const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] })
const fs = require('fs')
require('dotenv').config()
client.login(process.env.TOKEN)
client.commands = new Collection()
client.events = new Collection()
client.aliases = new Collection()
// MONGODB
const mongo = require('mongoose')
mongo
	.connect(process.env.MONGOPASS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log(`[MONGOOSE] - Connected!`))

function between(min, max) {
	return Math.random() * (max - min) + min
}

// RANDOM DOGIE WORD FILTER
var words = fs.readFileSync('./data/words.txt').toString()

module.exports = {
	client,
	between,
	words: words.split('\n'),
}

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
const eventsFiles = fs.readdirSync('./events/').filter((file) => file.endsWith('.js'))
for (const file of eventsFiles) {
	const eventGet = require(`./events/${file}`)
	console.log(`[EVENT HANDLER] - ${file} is now loaded!`)
	try {
		client.events.set(eventGet.name, eventGet)
	} catch (error) {
		return console.log(error)
	}
}
