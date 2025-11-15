import Levels from "../Schemas/level.js";
import { getLevelData } from "../services/levelService.js";

export default {
	name: "level",
	description: "Displays user's level and XP needed to level up.",
	aliases: ["xp", "lvl"],
	hidden: false,
	async execute(client, message, args) {
		const levelData = await getLevelData(message.author.id, message.guild.id);
		await message.channel.send(
			`**Level: ${levelData.level}** (**${levelData.xp - levelData.currentLevelXp}**/**${
				levelData.nextLevelXp - levelData.currentLevelXp
			}** XP)`
		);
	},
};
