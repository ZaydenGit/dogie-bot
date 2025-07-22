const elevatedUsers = require('../data/elevatedUsers.json')
const Money = require('../Schemas/money.js')
module.exports = {
	name: 'addmoney',
	description: 'add money to an account',
	aliases: ['addbalance', 'add'],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return
		let targetUser = message.mentions.users.first()
		if (!targetUser) targetUser = message.author
		args = args.filter((arg) => !arg.includes(`<@${targetUser.id}`))
		let val = args[0]
		targetUser = targetUser.id

		if (!elevatedUsers.includes(message.author.id)) return message.reply('cut that out')
		if (isNaN(val)) return message.channel.send('Please provide a valid number of coins')
		let moneySchema = await Money.findOne({
			userId: targetUser,
			serverId: message.guild.id,
		})
		if (!moneySchema) {
			const moneySchema = new Money({
				userId: targetUser,
				serverId: message.guild.id,
				money: 0,
			})
			await moneySchema.save().catch((e) => console.log(e))
		}
		moneySchema.money = parseInt(moneySchema.money) + parseInt(val)
		await moneySchema.save().catch((e) => console.log(e))
		return message.reply(`Successfully added ${val} Dogie Coins to <@${targetUser}>'s account. Their balance is now ${moneySchema.money} Dogie Coins.`)
	},
}
