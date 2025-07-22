const Money = require('../Schemas/money.js')
const cooldowns = new Map()
const { between } = require('../index.js')

module.exports = {
	name: 'gamble',
	description: 'User gambles an amount of money not exceeding 50,000 *or* all of it. Low chance of a jackpot, even lower chance of a mega jackpot.',
	aliases: ['invest'],
	hidden: false,
	async execute(client, message, args) {
		//cd
		const cooldownTime = 5 * 1000 //5s
		const now = Date.now()
		const cmdLastUsed = cooldowns.get(message.author.id)
		if (cmdLastUsed && now - cmdLastUsed < cooldownTime) {
			const timeLeft = Math.ceil((cooldownTime - (now - cmdLastUsed)) / 1000)
			if (between(0, 1) > 0.98) return message.reply(`Due to complaints and an ongoing investigation from a certain federal bureau you must wait ${timeLeft} seconds before gambling again.`)
			else return message.reply(`You must wait ${timeLeft} second(s) before using this again.`)
		}
		cooldowns.set(message.author.id, now)

		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		})
		if (!moneySchema) {
			moneySchema = new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: 0,
			})
			await moneySchema.save().catch((err) => console.log(err))
		}

		let gambledMoney = args[0]
		console.log(gambledMoney)
		if (message.guild === null) return console.log('Returned because message.guild is null')
		if (gambledMoney == 'all') {
			gambledMoney = moneySchema.money
			const bigBallerMessages = ['big balls on this one', 'holy schmoly', 'oh frick..', "are you sure...? i'll take that as a yes", 'wtf']
			if (gambledMoney > 100000) message.reply(bigBallerMessages[Math.round(between(0, bigBallerMessages.length - 1))])
		} else {
			if (isNaN(gambledMoney)) return message.reply('Please send a valid number.')
			gambledMoney = Math.floor(parseInt(gambledMoney)).toFixed()
			if (gambledMoney > 100000) return message.reply('You cannot gamble more than 100000 Dogie Coins at a time')
		}
		if (Math.sign(gambledMoney) === -1) return message.reply('You cannot gamble negative money.')

		if (moneySchema.money < gambledMoney) return message.reply('You do not have enough money.')
		if (!moneySchema.money) return message.reply('You need money to gamble first.')

		let rollNumber = between(0, 1).toFixed(2)
		console.log(rollNumber)

		if (rollNumber > 0.7) returnedMoney = Math.round(parseInt(gambledMoney) * between(0.25, 1.5))
		else returnedMoney = Math.round(parseInt(gambledMoney) * between(0.25, 1))

		if (returnedMoney === gambledMoney) return message.channel.send(`<@${message.author.id}> You did not rollNumber or lose any coins \<:aussiedogie:744999695893397614>`)

		if (rollNumber > 0.7 && rollNumber < 0.97) {
			moneySchema.money = moneySchema.money + returnedMoney
			if (returnedMoney / gambledMoney > 1) message.reply(`You won ${returnedMoney} Dogie Coins \<:happydogie:733840389840306176>! High roll! You now have ${moneySchema.money} Dogie Coins.`)
			else message.reply(`You won ${returnedMoney} Dogie Coins \<:happydogie:733840389840306176>! You now have ${moneySchema.money} Dogie Coins.`)
		}
		if (rollNumber <= 0.7) {
			moneySchema.money = moneySchema.money - returnedMoney
			if (Math.sign(moneySchema.money) === -1) message.reply(`You lost ${returnedMoney} Dogie Coins \<:saddogie:733838502155780165>. You are now in debt \<:saddogie:733838502155780165> \<:saddogie:733838502155780165> \<:saddogie:733838502155780165>.  You have ${moneySchema.money} Dogie Coins.`)
			else message.reply(`You lost ${returnedMoney} Dogie Coins \<:saddogie:733838502155780165>. You now have ${moneySchema.money} Dogie Coins.`)
		}
		if (rollNumber >= 0.97 && message.author.id) {
			let roll = between(0, 1).toFixed(1)
			if (roll >= 0.9) {
				moneySchema.money = moneySchema.money + gambledMoney * 20
				message.reply(`You won the MEGA JACKPOT of ${gambledMoney * 20} DOGIE COINS (20x THE GAMBLED MONEY)!!!! \<:angeldogie:777888818019172382>\<:angeldogie:777888818019172382>\<:angeldogie:777888818019172382>. You now have ${moneySchema.money} Dogie Coins!!`)
			} else {
				moneySchema.money = moneySchema.money + gambledMoney * 5
				message.reply(`You won the JACKPOT of ${gambledMoney * 5} DOGIE COINS (5x THE GAMBLED MONEY)!!!! \<:angeldogie:777888818019172382>. You now have ${moneySchema.money} Dogie Coins!`)
			}
		}

		await moneySchema.save().catch((err) => console.log(err))

		setTimeout(() => cooldowns.delete(message.author.id), cooldownTime)
	},
}
