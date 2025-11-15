import config from "../../config.json" with { type: "json" };

export const handleCommand = async (client, message) => {
	if (!message.content.toLowerCase().startsWith(config.prefix)) return false;
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command =
		client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return false;

	try {
		await command.execute(client, message, args);
        return true;
	} catch (e) {
		console.error(`Error executing command ${commandName}:`, e);
		message.reply(`Error executing that command.. . . <@${config.users.owners[0]}> fix your bot you clod... ..`);
		return true;
	}
};
