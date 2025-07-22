const { Colors, EmbedBuilder } = require('discord.js')
const Money = require('../Schemas/money.js')
const Levels = require('../Schemas/level.js')
module.exports = {
	name: 'leaderboard',
	description: 'Displays the levels leaderboard (accepted arguments: -c, -m, -coins, -money, in order to sort by money instead).',
	aliases: ['lb', 'top'],
	hidden: false,
	async execute(client, message, args) {
		let operator = 'xp'
		if (args[0] === '-money' || args[0] === '-m' || args[0] === '-c' || args[0] === '-coins') operator = 'money'
		if (operator === 'money') {
			var result = await Money.find({ serverId: message.guild.id })
				.sort([[operator, 'descending']])
				.catch((err) => console.log(err))
			var embed = new EmbedBuilder().setTitle('Dogie Coin Leaderboard')
		} else {
			var result = await Levels.find({ serverId: message.guild.id })
				.sort([['xp', 'descending']])
				.catch((err) => console.log(err))
			var embed = new EmbedBuilder().setTitle('Dogie Level Leaderboard')
		}
		if (result.length === 0) {
			embed.setColor('Red')
			embed.addFields('No data found')
		} else {
			embed.setColor('Green')
			if (result.length > 10) length = 10
			else length = result.length
			for (let i = 0; i < length; i++) {
				const user = await client.users.fetch(result[i].userId)
				if (operator === 'money') {
					let [levelSchema] = await Levels.find({ serverId: result[i].serverId, userId: result[i].userId })
					if (!levelSchema) await embed.addFields([{ name: `${i + 1}: ${user.username}`, value: `**Coins:** ${result[i].money}\, **Level: N/A**` }])
					else
						await embed.addFields([
							{
								name: `${i + 1}: ${user.username}`,
								value: `**Coins:** ${result[i].money}\, **Level:** ${Math.floor(Math.cbrt(levelSchema.xp / 1.25))}\, **XP:** ${levelSchema.xp}`,
							},
						])
					//else await embed.addField(`${i + 1}: ${user.username}`, `**Coins:** ${result[i].money}\, **Level:** ${Math.floor(Math.cbrt(Level.xp / 1.25))}\, **XP:** ${Level.xp - 1.25 * Math.floor(Math.cbrt(Level.xp / 1.25)) ** 3}`)
				} else {
					let [moneySchema] = await Money.find({ userId: result[i].userId, serverId: message.guild.id })
					if (!moneySchema) await embed.addFields([{ name: `${i + 1}: ${user.username}`, value: `**Level:** ${Math.floor(Math.cbrt(result[i].xp / 1.25))}\, **XP:** ${result[i].xp}\, **Coins: N/A**` }])
					//if (!money) await embed.addField(`${i + 1}: ${user.username}`, `**Level:** ${Math.floor(Math.cbrt(result[i].xp / 1.25))}\, **XP:** ${result[i].xp - 1.25 * Math.floor(Math.cbrt(result[i].xp / 1.25)) ** 3}\, **Coins: N/A**`)
					// else await embed.addField(`${i + 1}: ${user.username}`, `**Level:** ${Math.floor(Math.cbrt(result[i].xp / 1.25))}\, **XP:** ${result[i].xp - 1.25 * Math.floor(Math.cbrt(result[i].xp / 1.25)) ** 3}\, **Coins:** ${money.money}`)
					else await embed.addFields([{ name: `${i + 1}: ${user.username}`, value: `**Level:** ${Math.floor(Math.cbrt(result[i].xp / 1.25))}\, **XP:** ${result[i].xp}\, **Coins:** ${moneySchema.money}` }])
				}
			}
		}
		await message.channel.send({ embeds: [embed] })
	},
}
