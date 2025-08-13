import elevatedUsers from "../data/elevatedUsers.json" with { type: "json" };
import { EmbedBuilder } from "discord.js";
import Emotes from "../Schemas/emote.js";

export default {
	name: "scrapeemotes",
	description: "Scrapes emotes and stores them in database",
	aliases: ["scrape", "updateemotes", "newemotes", "newdogies", "scrapedogies", "updatedogies"],
	hidden: true,
	async execute(client, message, args) {
		if (!elevatedUsers.includes(message.author.id)) return message.reply("cut that out");
		
		const emotes = message.guild.emojis.cache;
		const emoteIds = new Set(emotes.map((e) => e.id));
		let added = 0;
		let removed = 0;

		const embed = new EmbedBuilder()
			.setTitle("Dogie Scraper Results: ")
			.addFields(
				{ name: "New Emotes Added", value: `${added}`, inline: false },
				{ name: "Deleted Emotes Removed", value: `${removed}`, inline: false },
				{ name: "Total Emotes", value: `0`, inline: true },
				{ name: "Blacklisted", value: `0`, inline: true },
				{ name: "Unblacklisted", value: `0`, inline: true }
			)
			.setColor("Yellow");
		
		const tempMessage = await message.reply({ embeds: [embed] });

		await Promise.all(
			Array.from(emotes).map(async ([id, emoji]) => {
				if (await Emotes.findOne({ id })) return
				await Emotes.create({
					id: String(id),
					name: emoji.name,
					rarity: "",
					blacklisted: false,
				});
				added++;
			})
		)

		const storedEmotes = await Emotes.find({});
		await Promise.all(
			storedEmotes.map(async (emote) => {
				if (emoteIds.has(String(emote.id))) return
				await Emotes.deleteOne({ id: emote.id });
				removed++;
			})
		)
		const [total, blacklisted] = await Promise.all([
			Emotes.countDocuments(),
			Emotes.countDocuments({ blacklisted: true }),
		])
		const unblacklisted = total - blacklisted;

		const completeEmbed = new EmbedBuilder()
			.spliceFields(0, embed.data.fields.length,
				{ name: "New Emotes Added", value: `${added}`, inline: false },
				{ name: "Deleted Emotes Removed", value: `${removed}`, inline: false },
				{ name: "Total Emotes", value: `${total}`, inline: true },
				{ name: "Blacklisted", value: `${blacklisted}`, inline: true },
				{ name: "Unblacklisted", value: `${unblacklisted}`, inline: true }
			)
			.setColor("Green");

		await tempMessage.edit({ embeds: [completeEmbed] });
	},
};
