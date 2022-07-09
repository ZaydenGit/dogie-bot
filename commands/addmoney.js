const Money = require('../Schemas/money.js')
module.exports = {
	name: 'addmoney',
	description: 'add money to an account',
	aliases: ['addbalance', 'add'],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return
		let targetUser = message.mentions.users.first()
		if (!targetUser) return message.reply('Tag a user to add coins to their account.')
		targetUser = targetUser.id
		let val = args[1]
		if (message.guild.members.cache.get(message.author.id).displayName.toLowerCase() === 'zayden' && message.author.id !== '296452888212013066') return message.reply('you are not THE zayden.')
		if (message.guild.members.cache.get(message.author.id).displayName.toLowerCase() === 'the zayden' && message.author.id !== '296452888212013066') return message.reply('cut that out')
		if (message.author.id !== '296452888212013066') return message.reply('you are not zayden.')
		//if (!message.member.roles.cache.some((r) => r.name === 'Dogie Trainer')) return message.channel.send('You must have the Dogie Trainer role to use this command.')
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
		moneySchema.save().catch((e) => console.log(e))
		return message.channel.send(`Successfully added ${val} Dogie Coins to <@${targetUser}>'s account. Their balance is now ${moneySchema.money} Dogie Coins.`)
	},
}
