const Money = require('../Schemas/money.js')
module.exports = {
	name: 'gamble',
	description: 'idiot',
	aliases: ['invest'],
	hidden: false,
	async execute(client, message, args) {
		let amount = args[0]
		if (isNaN(amount)) return message.reply('Please send a valid number.')
		amount = Math.floor(parseInt(amount)).toFixed()
		if (Math.sign(amount) === -1) return message.reply('You cannot gamble negative money.')
		if (message.guild === null) return console.log('Returned because message.guild is null')
		if (amount > 50000) return message.reply('You cannot gamble more than 50000 Dogie Coins at a time')
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
		if (moneySchema.money < amount) return message.reply('You do not have enough money.')
		if (!moneySchema.money) return console.log('You need money to gamble first.')
		else {
			function between(min, max) {
				return Math.random() * (max - min) + min
			}
			let gain = between(0, 1).toFixed(2)
			if (gain > 0.7) newamount = Math.round(parseInt(amount) * between(1, 1.25))
			else newamount = Math.round(parseInt(amount) * between(0, 1.75))
			if (gain > 0.7 && gain < 0.97) {
				moneySchema.money = moneySchema.money + newamount
				message.reply(`You won ${newamount} Coins \<:happydogie:733840389840306176>! You now have ${moneySchema.money} Coins.`)
			}
			if (gain <= 0.7) {
				moneySchema.money = moneySchema.money - newamount
				if (Math.sign(moneySchema.money) === -1) message.reply(`You lost ${newamount} Coins \<:saddogie:733838502155780165>. You are now in debt \<:saddogie:733838502155780165> \<:saddogie:733838502155780165> \<:saddogie:733838502155780165>.  You have ${moneySchema.money} Coins.`)
				else message.reply(`You lost ${newamount} Coins \<:saddogie:733838502155780165>. You now have ${moneySchema.money} Coins.`)
			}
			if (gain >= 0.97 && message.author.id) {
				let roll = between(0, 1).toFixed(1)
				if (roll >= 0.9) {
					moneySchema.money = moneySchema.money + amount * 20
					message.reply(`You won the MEGA JACKPOT of ${amount * 20} COINS (20x THE GAMBLED MONEY)!!!! \<:angeldogie:777888818019172382>\<:angeldogie:777888818019172382>\<:angeldogie:777888818019172382>. You now have ${moneySchema.money} Coins!!`)
				} else {
					moneySchema.money = moneySchema.money + amount * 5
					message.reply(`You won the JACKPOT of ${amount * 5} COINS (5x THE GAMBLED MONEY)!!!! \<:angeldogie:777888818019172382>. You now have ${moneySchema.money} Coins!`)
				}
			}
			if (newamount === amount) {
				return message.channel.send(`<@${message.author.id}> You did not gain or lose any coins \<:aussiedogie:744999695893397614>`)
			}
			moneySchema.save().catch((err) => console.log(err))
		}
	},
}
