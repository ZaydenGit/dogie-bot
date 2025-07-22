const elevatedUsers = require('../elevatedUsers.json')
const Money = require('../Schemas/money.js')
module.exports = {
	name: 'setmoney',
	description: 'set money in an account',
	aliases: ['set'],
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
			await moneySchema.save().catch((err) => console.log(err))
		}
		moneySchema.money = parseInt(val)
		moneySchema.save().catch((err) => console.log(err))
		return message.reply(`Successfully set <@${targetUser}>'s balance to ${val} Dogie Coins.`)
	},
}
