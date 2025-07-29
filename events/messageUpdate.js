const { client } = require('../index.js')
const pinCache = require('../data/pinCache.js')

client.on('messageUpdate', async (oldMsg, newMsg) => {
	if (oldMsg.pinned !== newMsg.pinned) {
		const channelId = newMsg.channel.channelId
		if (newMsg.pinned) {
			console.log(`Added pin ${newMsg.id} (#${newMsg.channel.name}) to pins list`)
			pinCache.addPin(channelId, newMsg.id)
		} else {
			console.log(`Removed pin ${newMsg.id} (#${newMsg.channel.name}) from pins list`)
			pinCache.removePin(channelId, newMsg.id)
		}
	}
})
