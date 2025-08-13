import config from "../../config.json" with { type: "json" };
import { between } from "../utils/between.js"
import { isReady } from "./ready.js";
import Levels from "../Schemas/level.js";
import Messages from "../Schemas/messages.js";
import Money from "../Schemas/money.js";

import dogielist from "../data/dogies.json" with { type: "json" };
var dogies = dogielist.dogielist.filter(Boolean);
import sendTempMessage from "../utils/sendTempMessage.js";
import { AttachmentBuilder } from "discord.js";
import { getWordOfTheDay } from "../utils/wordOfTheDay.js";

export default {
	name: "messageCreate",
	once: false,
	async execute (client, message) {
	
	if (message.author.bot) return;
	await isReady;

	// COMMAND HANDLER
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command =
		client.commands.get(commandName) ||
		client.commands.find((command) => command.aliases && command.aliases.includes(commandName));
	if (message.content.toLowerCase().startsWith(config.prefix) && command && client.commands.has(commandName)) {
		try {
			command.execute(client, message, args);
		} catch (e) {
			console.error(e);
			return;
		}
	}

	if (command) return;

	// ORCA!!!!
	let messageContent = message.content.toLowerCase().split(" ");
	if (messageContent.includes("orca") || messageContent.includes("orcas")) {
		const orcaImages = client.orcaImages
		try {
			const orcaText = [
				"i love orcas",
				"orcas are my favourite",
				"orca enjoyer",
				"look at this cool orca",
				"bro  he is so cool (what a cool orca!)",
				"love this guy (he is an orca)",
				"look at him go",
				"oh naw! look at him go",
				'talk about a "what the heck" moment!',
			];
			const fileUrl = orcaImages[Math.floor(between(0, orcaImages.length))]
			const attachment = new AttachmentBuilder(fileUrl, { name: fileUrl.split('/').pop().split('?')[0]})
			await message.reply( { content: orcaText[Math.floor(between(0, orcaText.length))], files: [attachment] });
		} catch (err) {
			console.error("Couldn't send orca image:", err);
		}
	}
	// RANDOM WORD FILTER
	const filteredWord = getWordOfTheDay().toLowerCase()
	for (let i = 0; i < messageContent.length; i++) {
		const index = messageContent[i].indexOf(filteredWord)
		if (index !== -1) {
			const highlighted = messageContent[i] !== filteredWord
			? messageContent[i].slice(0, index) + "**" + messageContent[i].slice(index, index + filteredWord.length) + "**" + messageContent[i].slice(index+filteredWord.length)
			: ""
			message.delete();
			return sendTempMessage(`BRO DO NOT SAY ${getWordOfTheDay().toUpperCase()}`+(highlighted ? ` (${highlighted})` : ""), message, 10000)
		}		
	}
	// LEVEL SCHEMA
	let levelSchema = await Levels.findOne({
		userId: message.author.id,
		serverId: message.guild.id,
	});
	if (!levelSchema)
		levelSchema = await new Levels({
			userId: message.author.id,
			xp: 0,
			msgDiscount: 0,
			serverId: message.guild.id,
		})
			.save()
			.catch((e) => console.log(e));

	// MESSAGE SCHEMA
	let messageSchema = await Messages.findOne({
		userId: message.author.id,
	});
	if (!messageSchema)
		messageSchema = await new Messages({ userId: message.author.id, messages: 0 }).save().catch((e) => console.log(e));

	// MONEY SCHEMA
	let moneySchema = await Money.findOne({
		userId: message.author.id,
		serverId: message.guild.id,
	});
	// MESSAGE COUNTER
	messageSchema.messages = messageSchema.messages + 1;
	if (messageSchema.messages >= 50 - levelSchema.msgDiscount) {
		messageSchema.messages = 0;
		
		let date = new Date().toLocaleString("en-US", { timezone: "America/Los_Angeles", weekday: "short" });
		let dogieValue = Math.round(between(0, dogies.length));
		let dogieCoins = Math.floor(25 * Math.round(6.488 * dogieValue * (0.2 * dogieValue) + 20) * (date === "Mon" ? 1.25 : 1));
		sendTempMessage(`<@${message.author.id}> You found a ${dogies[dogieValue]} ! It's worth ${date === "Mon" 
			? `a boosted ${dogieCoins} Dogie Coins! Happy Dogie Monday!!!!!`
			: `${dogieCoins} Dogie Coins`}`, message)

		if (!moneySchema)
			moneySchema = await new Money({
				userId: message.author.id,
				serverId: message.guild.id,
				money: dogieCoins,
			})
				.save()
				.catch((e) => console.log(e));
		moneySchema.money = moneySchema.money + dogieCoins;
		await moneySchema.save();
	}
	// console.log(`[MESSAGE] - Sender: ${message.author.tag}, Count: ${messageSchema.messages}`)
	await messageSchema.save();
}};
