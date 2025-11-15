import { isReady } from "./ready.js";
import { handleCommand } from "../handlers/commandHandler.js";
import { checkOrca } from "../handlers/orcaReplyHandler.js";
import { runMessageCounter } from "../handlers/dogieSpawnHandler.js";
import { checkWordFilter } from "../handlers/wordFilterHandler.js";

export default {
	name: "messageCreate",
	once: false,
	async execute(client, message) {
		if (message.author.bot) return;
		await isReady;

		const isCommand = await handleCommand(client, message);
		if (isCommand) return;

		const isFiltered = await checkWordFilter(message);
		if (isFiltered) return;

		await checkOrca(client, message);
		await runMessageCounter(message);
	},
};
