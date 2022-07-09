const Money = require('../Schemas/money.js')

module.exports = {
	name: 'balance',
	description: 'display balance',
	aliases: ['bal', 'money'],
	hidden: false,
	async execute(client, message, args) {
		if (message.guild === null) return
		let targetUser = message.mentions.users.first()
		if (!targetUser) targetUser = message.author
		targetUser = targetUser.id
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
		if (!moneySchema || moneySchema === 0) {
			return message.reply(`You have no Dogie Coins :(`)
		}
		if (targetUser === message.author.id) return message.reply(`You have ${moneySchema.money} Dogie Coins`)
		else return message.reply(`<@${targetUser}>'s balance is ${moneySchema.money}`)
	},
}
