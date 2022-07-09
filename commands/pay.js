const Money = require('../Schemas/money')
module.exports = {
	name: 'pay',
	description: 'transfer money from your account to another',
	aliases: ['send'],
	hidden: false,
	async execute(client, message, args) {
		if (isNaN(args[1])) return message.channel.send('Invalid number')
		args[1] = Math.floor(parseInt(args[1])).toFixed()
		let targetUser = message.mentions.users.first()
		if (!targetUser) return message.channel.send('You must mention a user to send them money!')
		let amount = args[1]
		if (Math.sign(args[1]) === -1) return message.channel.send('You cannot send a negative amount of money.')

		if (targetUser.id === message.author.id) return message.channel.send("You can't send money to yourself!")
		let moneySchema = await Money.findOne({
			userId: targetUser.id,
			serverId: message.guild.id,
		})
		if (!moneySchema) {
			moneySchema = new Money({
				userId: targetUser.id,
				serverId: message.guild.id,
				money: 0,
			})
			await moneySchema.save().catch((e) => console.log(e))
		}
		let userMoney = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		})
		if (!userMoney) {
			userMoney = new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: 0,
			})
			await userMoney.save().catch((e) => console.log(e))
		}
		if (userMoney.money < amount) return message.channel.send('You cannot send more money than you have')
		userMoney.money = parseInt(userMoney.money) - parseInt(amount)
		userMoney.save().catch((e) => console.log(e))
		moneySchema.money = parseInt(moneySchema.money) + parseInt(amount)
		moneySchema.save().catch((e) => console.log(e))
		message.channel.send(`Successfully sent ${amount} to <@${targetUser.id}>. Their balance is now ${moneySchema.money}, and your balance is now ${userMoney.money}`)
	},
}
