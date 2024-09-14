const dogieMonday = require('../events/messageCreate.js')
// import { d } from '../events/messageCreate.js'
module.exports = {
	name: 'ask',
	description: 'gibbity',
	aliases: ['chad gibbity'],
	hidden: false,
	async execute(client, message, args) {
		message.reply('not ready yet :p')
	},
}
