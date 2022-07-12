const awesome = require('../awesome.json')
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
		if (!awesome.includes(message.author.id)) return message.reply('cut that out')
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
