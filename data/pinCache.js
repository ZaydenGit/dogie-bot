const pinCache = {}
const { between } = require('../index.js')

module.exports = {
	getPins: () => pinCache,
	addPin(channelId, messageId, timestamp) {
		if (!pinCache[channelId]) pinCache[channelId] = []
		if (!pinCache[channelId].includes(messageId)) {
			pinCache[channelId].push(messageId)
		}
	},
	removePin(channelId, messageId) {
		if (pinCache[channelId]) {
			pinCache[channelId] = pinCache[channelId].filter((id) => id !== messageId)
			if (pinCache[channelId].length === 0) delete pinCache[channelId]
		}
	},
	setPins(channelId, pins) {
		pinCache[channelId] = pins.map((msg) => msg.id)
	},
	getRandomPin(channelId = null) {
		let entries = []
		if (channelId) {
			channelId = channelId.id
			const pins = pinCache[channelId] || []
			entries = pins.map((id) => ({ channelId, messageId: id }))
		} else {
			entries = Object.entries(pinCache).flatMap(([channelId, ids]) => ids.map((id) => ({ channelId, messageId: id })))
		}

		if (entries.length === 0) return null
		return entries[Math.floor(between(0, entries.length))]
	},
}
