const Money = require('../Schemas/money')
module.exports = {
	name: 'prostitute',
	description: 'get out of debt free card',
	aliases: ['getoutofdebtfree', 'debt', 'prostitution'],
	hidden: false,
	async execute(client, message, args) {
		function between(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
		let moneySchema = await Money.findOne({
			userId: message.author.id,
			serverId: message.guild.id,
		})
		if (!moneySchema) {
			const moneySchema = new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: 0,
			})
			await moneySchema.save().catch((e) => console.log(e))
		}
		if (Math.sign(moneySchema.money) > 5000) return message.channel.send('You must be broke to use this command')
		//cd
		const cooldownTime = 60 * 1000 //15s
		const now = Date.now()
		const cmdLastUsed = cooldowns.get(message.author.id)
		if (cmdLastUsed && now - cmdLastUsed < cooldownTime) {
			const timeLeft = Math.ceil((cooldownTime - (now - cmdLastUsed)) / 1000)
			return message.reply(`You must wait ${timeLeft} second(s) before using this again.`)
		}
		cooldowns.set(message.author.id, now)
		let tip = Math.round(between(1, 4))
		moneySchema.money += (tip - 1) * 1000
		moneySchema.save().catch((e) => console.log(e))
		switch (tip) {
			case 1:
				return message.channel.send(`You were pretty bad. Dogie doesn't leave a tip, but still gets you out of debt.`)
			case 2:
				return message.channel.send(`You were alright. Dogie tips you ${(tip - 1) * 1000} Coins \<:dogie:746903359071584337>`)
			case 3:
				return message.channel.send(`You were great!. Dogie tips you ${(tip - 1) * 1000} Coins \<:happydogie:733840389840306176>`)
			case 4:
				return message.channel.send(`You were amazing!. Dogie tips you ${(tip - 1) * 1000} Coins \<:angeldogie:777888818019172382>`)
		}
		setTimeout(() => cooldowns.delete(message.author.id), cooldownTime)
	},
}
