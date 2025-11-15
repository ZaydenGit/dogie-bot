import { EmbedBuilder } from "discord.js";
import Money from "../Schemas/money.js";
import Levels from "../Schemas/level.js";

const fetchLeaderboardData = async (serverId, operator) => {
	let firstData, secondData;
	if (operator === "money") {
		firstData = await Money.find({ serverId: serverId })
			.sort({ money: "descending" })
			.limit(10)
			.catch((err) => console.log(err));
		const userIds = firstData.map((user) => user.userId);
		const levelResults = await Levels.find({ serverId: serverId, userId: { $in: userIds } });
		secondData = new Map(levelResults.map((level) => [level.userId, level]));
	} else {
		firstData = await Levels.find({ serverId: serverId })
			.sort({ xp: "descending" })
			.limit(10)
			.catch((err) => console.log(err));
		const userIds = firstData.map((user) => user.userId);
		const moneyResults = await Money.find({ serverId: serverId, userId: { $in: userIds } });
		secondData = new Map(moneyResults.map((money) => [money.userId, money]));
	}
	return { firstData, secondData };
};
export default {
	name: "leaderboard",
	description:
		"Displays the levels leaderboard (accepted arguments: -c, -m, -coins, -money, in order to sort by money instead).",
	aliases: ["lb", "top"],
	hidden: false,
	async execute(client, message, args) {
		let operator = "xp";
		if (args[0] === "-money" || args[0] === "-m" || args[0] === "-c" || args[0] === "-coins") operator = "money";

		const { firstData, secondData } = await fetchLeaderboardData(message.guild.id, operator);
		const embed = new EmbedBuilder()
			.setTitle(`Dogie ${operator === "money" ? "Coin" : "Level"} Leaderboard`)
			.setColor("Green");

		if (firstData.length === 0) {
			embed.setColor("Red");
			embed.setDescription("No data found");
			return await message.reply({ embeds: [embed] });
		}

		const fields = await Promise.all(
			firstData.map(async (user, index) => {
				const fetchedUser = await client.users.fetch(user.userId).catch(() => null);
				const username = fetchedUser ? fetchedUser.username : "Unknown User";

				let levelData, moneyData;

				if (operator === "money") {
					moneyData = { money: user.money };
					levelData = secondData.get(user.userId);
				} else {
					levelData = { xp: user.xp };
					moneyData = secondData.get(user.userId);
				}
				const level = levelData ? Math.floor(Math.cbrt(levelData.xp / 1.25)) : "N/A";
				const xp = levelData ? levelData.xp : "N/A";
				const money = moneyData ? moneyData.money : "N/A";

				return {
					name: `${index + 1}: ${username}`,
					value: `**Level:** ${level} | **XP:** ${xp} | **Coins:** ${money}`,
				};
			})
		);

		embed.addFields(fields);
		await message.reply({ embeds: [embed] });
	},
};
