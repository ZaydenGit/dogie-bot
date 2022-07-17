const { prefix } = require('../config.json')
const client = require(`../index.js`).client
const ranWord = require(`../index.js`).ranWord

const Levels = require('../Schemas/level.js')
const Messages = require('../Schemas/messages.js')
const Money = require('../Schemas/money.js')

function between(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

let d = new Date()
d.setTime(d.getTime() + d.getTimezoneOffset() * 60000)
d.setTime(d.getTime() - 28800000)

const dogielist = require('../dogies.json')
var dogies = dogielist.dogielist.filter(Boolean)
var orcaArray = require('../orcas.json')

client.on('messageCreate', async (message) => {
	// COMMAND HANDLER
	if (message.author.bot || message.channel.type === 'DM') return

	const args = message.content.slice(prefix.length).split(/ +/)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName) || client.commands.find((command) => command.aliases && command.aliases.includes(commandName))
	if (message.content.toLowerCase().startsWith(prefix) && command && client.commands.has(commandName)) {
		try {
			command.execute(client, message, args)
		} catch (e) {
			console.log(e)
			channel.message.send(e)
			return
		}
	}

	if (command) return

	// ORCA!!!!
	let messageContent = message.content.toLowerCase().split(' ')
	if (messageContent.includes('orca') || messageContent.includes('orcas')) {
		try {
			orcaText = ['i love orcas', 'orcas are my favourite', 'orca enjoyer', 'look at this cool orca', 'bro  he is so cool (what a cool orca!)', 'love this guy (he is an orca)', 'look at him go', 'oh naw! look at him go', 'talk about a "what the heck" moment!']
			await message.reply(orcaText[between(0, orcaText.length)])
			await message.channel.send(orcaArray[between(0, orcaArray.length)].url)
		} catch (e) {
			console.log(e)
		}
	}
	// RANDOM WORD FILTER
	for (i = 0; i < messageContent.length; i++) {
		if (messageContent[i] === ranWord.toLowerCase().split('\r')[0]) {
			message.delete()
			return message.channel
				.send(`BRO DO NOT SAY ${ranWord.toUpperCase()}`)
				.then((msg) => {
					setTimeout(() => msg.delete(), 5000)
				})
				.catch((e) => console.log(e))
		}
	}
	// LEVEL SCHEMA
	let levelSchema = await Levels.findOne({
		userId: message.author.id,
		serverId: message.guild.id,
	})
	if (!levelSchema)
		levelSchema = await new Levels({
			userId: message.author.id,
			xp: 0,
			msgDiscount: 0,
			serverId: message.guild.id,
		})
			.save()
			.catch((e) => console.log(e))

	// MESSAGE SCHEMA
	let messageSchema = await Messages.findOne({
		userId: message.author.id,
	})
	if (!messageSchema) messageSchema = await new Messages({ userId: message.author.id, messages: 0 }).save().catch((e) => console.log(e))

	// MONEY SCHEMA
	let moneySchema = await Money.findOne({
		userId: message.author.id,
		serverId: message.guild.id,
	})
	// MESSAGE COUNTER
	messageSchema.messages = messageSchema.messages + 1
	if (messageSchema.messages >= 50 - levelSchema.msgDiscount) {
		messageSchema.messages = 0
		if (d.getDay() === 1) var dateBonus = 1.25
		else var dateBonus = 1
		let dogieValue = between(0, dogies.length)
		// if (message.author.id === '428560505683050496') dogieValue = 1;
		let dogieCoins = Math.floor(25 * Math.round(6.488 * dogieValue * (0.2 * dogieValue) + 20) * dateBonus)
		if (d.getDay() === 1) message.channel.send(`<@${message.author.id}> You found a ${dogies[dogieValue]} ! It's worth a boosted ${dogieCoins} Dogie Coins! Happy Dogie Monday!!!!!`)
		else message.channel.send(`<@${message.author.id}> You found a ${dogies[dogieValue]} ! It's worth ${dogieCoins} Dogie Coins`)
		if (!moneySchema)
			moneySchema = await new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: dogieCoins,
			})
				.save()
				.catch((e) => console.log(e))
		moneySchema.money = moneySchema.money + dogieCoins
		await moneySchema.save()
	}
	console.log(`[MESSAGE] - Sender: ${message.author.tag}, Count: ${messageSchema.messages}`)
	await messageSchema.save().catch((e) => console.log(e))
})
