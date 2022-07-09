const Money = require('../Schemas/money')
module.exports = {
	name: 'prostitute',
	description: 'get out of debt free card',
	aliases: ['getoutofdebtfree', 'debt', 'prostitution'],
	hidden: false,
	async execute(client, message, args) {
		function between(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		})
		if (!moneySchema) {
			const moneySchema = new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: 0,
			})
			await money.save().catch((e) => console.log(e))
		}
		if (Math.sign(moneySchema.money) != -1) return message.channel.send('You must be in debt (negative money) to use this command.')
		let tip = Math.round(between(1, 4))
		moneySchema.money = (tip - 1) * 1000
		moneySchema.save().catch((e) => console.log(e))
		if (tip === 1) return message.channel.send(`You were pretty bad. Dogie doesn't leave a tip, but still gets you out of debt.`)
		if (tip === 2) return message.channel.send(`You were alright. Dogie tips you ${(tip - 1) * 1000} Coins \<:dogie:746903359071584337>`)
		if (tip === 3) return message.channel.send(`You were great!. Dogie tips you ${(tip - 1) * 1000} Coins \<:happydogie:733840389840306176>`)
		if (tip === 4) return message.channel.send(`You were amazing!. Dogie tips you ${(tip - 1) * 1000} Coins \<:angeldogie:777888818019172382>`)
	},
}
