const Money = require('../Schemas/money')
module.exports = {
	name: 'payuser',
	description: 'transfer money from one member to another',
	aliases: ['pay', 'send'],
	hidden: false,
	async execute(client, message, args) {
		let targetUser = message.mentions.users.first()
		if (!targetUser) targetUser = message.author
		args = args.filter((arg) => !arg.includes(`<@${targetUser.id}`))
		let sentMoney = args[0]
		if (isNaN(sentMoney)) return message.channel.send('Invalid number')
		sentMoney = Math.floor(parseInt(sentMoney)).toFixed()
		if (Math.sign(sentMoney) === -1) return message.channel.send('You cannot send a negative amount of money.')

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
		if (userMoney.money < sentMoney) return message.channel.send('You cannot send more money than you have')
		userMoney.money = parseInt(userMoney.money) - parseInt(sentMoney)
		await userMoney.save().catch((e) => console.log(e))
		moneySchema.money = parseInt(moneySchema.money) + parseInt(sentMoney)
		await moneySchema.save().catch((e) => console.log(e))
		await message.channel.send(`Successfully sent ${sentMoney} to <@${targetUser.id}>. Their balance is now ${moneySchema.money}, and your balance is now ${userMoney.money}`)
	},
}
