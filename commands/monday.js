const { AttachmentBuilder } = require('discord.js')
const path = require('path')
const dogieMondayVideo = new AttachmentBuilder(path.join(__dirname, '../assets/dog_monday.mp4'))
module.exports = {
	name: 'monday',
	description: 'moday',
	aliases: ['moday'],
	hidden: false,
	async execute(client, message, args) {
		const dogieMonday = new Date().toLocaleDateString('en-US', { timezone: 'America/Los Angeles', weekday: 'long' })
		if (dogieMonday === 'Monday') {
			await message.channel.send({ content: 'HAPPY DOGIE MONDAY :tada: :tada: :partying_face: :partying_face:', files: [dogieMondayVideo] })
		} else {
			await message.channel.send('not moday :sob: :sob:')
		}
	},
}
