const { prefix } = require('../config.json')
const { client, between } = require(`../index.js`)
const fs = require('fs')

const Levels = require('../Schemas/level.js')
const Messages = require('../Schemas/messages.js')
const Money = require('../Schemas/money.js')
const ranWordPath = path.join(__dirname, '../data/ranWord.txt')

let d = new Date().toLocaleString('en-US', { timezone: 'America/Los_Angeles', weekday: 'short' })

const dogielist = require('../data/dogies.json')
var dogies = dogielist.dogielist.filter(Boolean)
var orcaArray = require('../data/orcas.json')

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
		if (messageContent[i] === fs.readFileSync(ranWordPath).toString().toLowerCase().split('\r')[0]) {
			message.delete()
			return message.channel
				.send(`BRO DO NOT SAY ${fs.readFileSync(ranWordPath).toString().toUpperCase()}`)
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
		let dateBonus = 1
		if (d === 'Monday') dateBonus = 1.25
		let dogieValue = between(0, dogies.length)
		let dogieCoins = Math.floor(25 * Math.round(6.488 * dogieValue * (0.2 * dogieValue) + 20) * dateBonus)
		if (d === 'Monday')
			message.channel.send(`<@${message.author.id}> You found a ${dogies[dogieValue]} ! It's worth a boosted ${dogieCoins} Dogie Coins! Happy Dogie Monday!!!!!`).then((msg) => {
				setTimeout(() => msg.delete(), 5000)
			})
		else
			message.channel.send(`<@${message.author.id}> You found a ${dogies[dogieValue]} ! It's worth ${dogieCoins} Dogie Coins`).then((msg) => {
				setTimeout(() => msg.delete(), 5000)
			})
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
	// console.log(`[MESSAGE] - Sender: ${message.author.tag}, Count: ${messageSchema.messages}`)
	await messageSchema.save().catch((e) => console.log(e))
})
