import pinCache from "../utils/pinCache.js";

export default {
	name: "messageUpdate",
	once: false,
	async execute(client, oldMsg, newMsg) {
		if (oldMsg.pinned !== newMsg.pinned) {
			const channelId = newMsg.channel.channelId;
			if (newMsg.pinned) {
				console.log(`[PINS CACHE] Added pin ${newMsg.id} (#${newMsg.channel.name}) to pins cache.`);
				pinCache.addPin(channelId, newMsg.id);
			} else {
				console.log(`[PINS CACHE] Removed pin ${newMsg.id} (#${newMsg.channel.name}) from pins cache.`);
				pinCache.removePin(channelId, newMsg.id);
			}
		}
	},
};
