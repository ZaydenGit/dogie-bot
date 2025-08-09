import config from "../../config.json" with { type: "json" };
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import { EmbedBuilder } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load all command files from the commands folder
const commandsPath = path.join(__dirname, "../commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

export default {
	name: "help",
	description: "Displays a help menu with every command, or info about a specific command.",
	aliases: ["commands"],
	hidden: false,
	async execute(client, message, args) {
		const data = [];
		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setTitle(`Dogie Bot Help`)
			.setThumbnail(client.user.avatarURL())
			.setFooter({
				text: `You can send '${config.prefix}help [command name]' to get info on a specific command.`,
			});

		// if no specific command requested
		if (!args.length) {
			for (const file of commandFiles) {
				const pull = (await import(pathToFileURL(path.join(commandsPath, file)))).default;

				if (message.member.roles.cache.some((r) => r.name === "Dogie Trainer") && pull.name) {
					data.push(pull.name);
				} else if (!pull.hidden && pull.name) {
					data.push(pull.name);
				}
			}

			embed.addFields([{ name: "Commands:", value: data.join(", ") }]);
			return await message.reply({ embeds: [embed] });
		}

		// specific command info
		const name = args[0].toLowerCase();
		const commandPath = path.join(commandsPath, `${name}.js`);

		if (fs.existsSync(commandPath)) {
			const pull = (await import(pathToFileURL(commandPath))).default;

			embed.setTitle(`**Name:** ${pull.name}`);
			if (pull.aliases?.length) {
				embed.addFields([{ name: `**Aliases:**`, value: pull.aliases.join(", ") }]);
			}
			if (pull.description) {
				embed.addFields([{ name: `**Description:**`, value: pull.description }]);
			}
			await message.reply({ embeds: [embed] });
		} else {
			return message.reply(`That's not a valid command.`);
		}
	},
};
