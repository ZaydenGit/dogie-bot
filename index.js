import { Client, Partials, Collection, GatewayIntentBits } from "discord.js";
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
});
import fs from "fs";
import { pathToFileURL, fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import path from "path";
import dotenv from "dotenv";

dotenv.config();
client.login(process.env.TOKEN);
client.commands = new Collection();
client.events = new Collection();
client.aliases = new Collection();
// MONGODB
import mongo from "mongoose";
mongo
	.connect(process.env.MONGOPASS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log(`[MONGOOSE] - Connected!`));

// RANDOM DOGIE WORD FILTER

export { client };

// COMMAND HANDLER
const commandFiles = fs.readdirSync(path.join(__dirname, "./src/commands")).filter((file) => file.endsWith(".js"));
await Promise.all(
	commandFiles.map(async (file) => {
		try {
			const { default: pull } = await import(pathToFileURL(path.join(__dirname, "./src/commands", file)));
			client.commands.set(pull.name, pull);

			if (pull.aliases && Array.isArray(pull.aliases)) {
				pull.aliases.forEach((alias) => client.commands.set(alias, pull));
			}

			console.log(`[COMMAND] - ${file} is now loaded!`);
		} catch (error) {
			console.error(`Failed to load ${file}: `, error);
		}
	})
);

// EVENT HANDLER
const eventsFiles = fs.readdirSync(path.join(__dirname, "./src/events")).filter((file) => file.endsWith(".js"));
await Promise.all(
	eventsFiles.map(async (file) => {
		try {
			const { default: event } = await import(pathToFileURL(path.join(__dirname, "./src/events", file)));
			client.events.set(event.name, event);

			if (event.once) {
				client.once(event.name, (...args) => event.execute(client, ...args));
			} else {
				client.on(event.name, (...args) => event.execute(client, ...args));
			}
			console.log(`[EVENT HANDLER] - ${file} is now loaded!`);
		} catch (error) {
			console.error(`Failed to load ${file}: `, error);
		}
	})
);
