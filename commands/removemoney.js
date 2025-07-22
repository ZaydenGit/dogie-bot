const elevatedUsers = require('../elevatedUsers.json')
const Money = require('../Schemas/money.js')
module.exports = {
	name: 'removemoney',
	description: 'remove money from an account',
	aliases: ['removebalance', 'delbalance', 'delmoney', 'remove'],
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
		// if (!moneySchema.money || moneySchema.money === 0) message.channel.send('You do not have any money in your account.')
		moneySchema.money = parseInt(moneySchema.money) - parseInt(val)
		moneySchema.save().catch((e) => console.log(e))
		message.reply(`Successfully removed ${val} Dogie Coins from <@${targetUser}>'s account. Their balance is now ${moneySchema.money} Dogie Coins.`)
	},
}
