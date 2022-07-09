const Money = require('../Schemas/money.js')
module.exports = {
	name: 'removemoney',
	description: 'remove money from an account',
	aliases: ['removebalance', 'delbalance', 'delmoney', 'remove'],
	hidden: true,
	async execute(client, message, args) {
		if (message.guild === null) return console.log('Returned because message.guild is null')
		let targetUser = message.mentions.users.first()
		if (!targetUser) return message.reply('Tag a user to remove coins from their account.')
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
		// if (!moneySchema.money || moneySchema.money === 0) message.channel.send('You do not have any money in your account.')
		moneySchema.money = parseInt(moneySchema.money) - parseInt(val)
		moneySchema.save().catch((e) => console.log(e))
		message.channel.send(`Successfully removed ${val} Dogie Coins from <@${targetUser}>'s account. Their balance is now ${moneySchema.money} Dogie Coins.`)
	},
}
