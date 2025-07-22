// const dogieMonday = require('../events/messageCreate.js')

// import { d } from '../events/messageCreate.js'
module.exports = {
	name: 'monday',
	description: 'moday',
	aliases: ['moday'],
	hidden: false,
	async execute(client, message, args) {
		const dogieMonday = new Date().toLocaleDateString('en-US', { timezone: 'America/Los Angeles', weekday: 'long' })
		console.log(dogieMonday)
		if (dogieMonday === 'Monday') {
			message.channel.send('HAPPY DOGIE MONDAY :tada: :tada: :partying_face: :partying_face:')
			message.channel.send('https://cdn.discordapp.com/attachments/369926552076419082/793031878960873472/dog_monday.mp4')
		} else {
			message.channel.send('not moday :sob: :sob:')
		}
	},
}
