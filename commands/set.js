const Money = require('../Schemas/money.js')
module.exports = {
	name: 'set',
	description: 'set money in an account',
	aliases: ['set'],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return console.log('Returned because message.guild is null')
		let targetUser = message.mentions.users.first()
		if (!targetUser) return message.reply('Tag a user to set coins in their account.')
		targetUser = targetUser.id
		let val = args[1]
		if (message.guild.members.cache.get(message.author.id).displayName.toLowerCase() === 'zayden' && message.author.id !== '296452888212013066') return message.reply('you are not THE zayden.')
		if (message.guild.members.cache.get(message.author.id).displayName.toLowerCase() === 'the zayden' && message.author.id !== '296452888212013066') return message.reply('cut that out')
		if (message.author.id !== '296452888212013066') return message.reply('you are not zayden.')
		// if (!message.member.roles.cache.some((r) => r.name === 'Dogie Trainer')) return message.channel.send('You must have the Dogie Trainer role to use this command.')
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
		return message.channel.send(`Successfully set <@${targetUser}>'s balance to ${val} Dogie Coins.`)
	},
}
