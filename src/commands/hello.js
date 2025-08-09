export default {
	name: "hello",
	aliases: ["hi"],
	description: "hi dogie",
	hidden: false,
	async execute(client, message, args) {
		await message.react("746903359071584337");
		await message.reply("<:dogie:746903359071584337> hi");
	},
};
