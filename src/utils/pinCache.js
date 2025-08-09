import { between } from "./between.js";
import { ChannelType } from "discord.js";
const pinCache = {};

export default {
	getPins: () => pinCache,
	addPin(channelId, messageId, timestamp) {
		if (!pinCache[channelId]) pinCache[channelId] = [];
		if (!pinCache[channelId].includes(messageId)) {
			pinCache[channelId].push(messageId);
		}
	},
	removePin(channelId, messageId) {
		if (pinCache[channelId]) {
			pinCache[channelId] = pinCache[channelId].filter((id) => id !== messageId);
			if (pinCache[channelId].length === 0) delete pinCache[channelId];
		}
	},
	setPins(channelId, pins) {
		pinCache[channelId] = pins.map((msg) => msg.id);
	},
	getRandomPin(channelId = null) {
		let entries = [];
		if (channelId) {
			channelId = channelId.id;
			const pins = pinCache[channelId] || [];
			entries = pins.map((id) => ({ channelId, messageId: id }));
		} else {
			entries = Object.entries(pinCache).flatMap(([channelId, ids]) => ids.map((id) => ({ channelId, messageId: id })));
		}

		if (entries.length === 0) return null;
		return entries[Math.floor(between(0, entries.length))];
	},
	async cachePins(guild) {
		console.log("[PINS CACHE] Fetching pins in guild " + guild.name);
		let totalCachedPins = 0;
		let totalCachedChannels = 0;

		const channelPromises = [];

		for (const [_, channel] of guild.channels.cache) {
			if (![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) continue;

			const promise = (async () => {
				try {
					const pins = await channel.messages.fetchPinned();
					await this.setPins(channel.id, pins);
					totalCachedPins += pins.size;
					totalCachedChannels++;
					process.stdout.write(`\r${" ".repeat(100)}\r[PINS CACHE] Cached pins from #${channel.name}.`);
				} catch (err) {
					if (err.message === "Missing Access") return;
					console.error(`[PINS CACHE] Failed to cache #${channel.name}:`, err.message);
				}
			})();

			channelPromises.push(promise);
		}

		await Promise.all(channelPromises);

		process.stdout.write(
			`\r${" ".repeat(100)}\r[PINS CACHE] Cached ${totalCachedPins} pins from ${totalCachedChannels} channels.\n`
		);
	},
};
