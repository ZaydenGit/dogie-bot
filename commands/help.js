const { prefix } = require('../config.json')
const fs = require('fs')
const Discord = require('discord.js')
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	hidden: false,
	async execute(client, message, args) {
		const data = []
		embed = new Discord.EmbedBuilder()
			.setColor('Blue')
			.setTitle(`Dogie Bot Help`)
			.setThumbnail(client.user.avatarURL())
			.setFooter({ text: `You can send '${prefix}help [command name]' to get info on a specific command.` })
		if (!args.length) {
			for (const file of commandFiles) {
				const pull = require(`../commands/${file}`)
				if (message.member.roles.cache.some((r) => r.name === 'Dogie Trainer') && pull.name) data.push(pull.name)
				else if (!pull.hidden && pull.name) data.push(pull.name)
			}
			embed.addFields([{ name: 'Commands:', value: data.join(', ') }])
			return message.reply({ embeds: [embed] })
		} else {
			const name = args[0].toLowerCase().toString()
			if (fs.existsSync(`./commands/${name}.js`)) {
				const pull = require(`../commands/${name}.js`)
				embed.setTitle(`**Name:** ${pull.name}`)
				if (pull.aliases) embed.addFields([{ name: `**Aliases:**`, value: pull.aliases.join(', ') }])
				if (pull.description) embed.addFields([{ name: `**Description:**`, value: pull.description }])
				message.reply({ embeds: [embed] })
			} else {
				return message.reply(`That's not a valid command.`)
			}
		}
	},
}
