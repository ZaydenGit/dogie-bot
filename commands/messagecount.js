const Messages = require('../Schemas/messages.js')
const Levels = require('../Schemas/level.js')

module.exports = {
	name: 'messagecount',
	description: 'check your message count',
	aliases: ['msgcount', 'msgs', 'mc'],
	hidden: false,
	async execute(client, message, args) {
		let levelSchema = await Levels.findOne({ userId: message.author.id })
		if (!levelSchema)
			levelSchema = await new Levels({
				userId: message.author.id,
				xp: 0,
				shopDiscount: 0,
				msgDiscount: 0,
			})
				.save()
				.catch((err) => console.log(err))
		let messageSchema = await Messages.findOne({ userId: message.author.id })
		if (!messageSchema) {
			messageSchema = new Messages({ userId: message.author.id, messages: 0 })
			await messageSchema.save().catch((err) => console.log(err))
		}
		return message.reply(`You have ${messageSchema.messages} messages out of ${50 - levelSchema.msgDiscount} required to gain Dogie Coins. Your current discount is ${levelSchema.msgDiscount}`)
	},
}
