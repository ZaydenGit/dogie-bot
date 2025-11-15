import Level from "../Schemas/level.js";

const _calculateLevel = (xp) => {
	return Math.floor(Math.cbrt(xp / 1.25));
};

const _calculateLevelXp = (level) => {
	return Math.floor(1.25 * Math.pow(level, 3));
};

const _calculateNewDiscount = (newLevel, currentDiscount) => {
	if (currentDiscount >= 25) return currentDiscount;

	const potentialDiscount = Math.floor(newLevel / 10);
	if (potentialDiscount > currentDiscount) {
		return newLevel > 250 ? 25 : potentialDiscount;
	}
	return currentDiscount;
};

export const getLevelSchema = async (userId, serverId) => {
	let levelSchema = await Level.findOne({
		userId: userId,
		serverId: serverId,
	});
	if (!levelSchema) {
		levelSchema = await new Level({
			userId: userId,
			serverId: serverId,
			xp: 0,
			msgDiscount: 0,
		})
			.save()
			.catch((e) => console.log(e));
	}
	return levelSchema;
};

export const getLevelData = async (userId, serverId) => {
	const levelSchema = await getLevelSchema(userId, serverId);
	const level = _calculateLevel(levelSchema.xp);
	const currentLevelXp = _calculateLevelXp(level);
	const nextLevelXp = _calculateLevelXp(level + 1);
	return {
		level: level,
		xp: levelSchema.xp,
		currentLevelXp: currentLevelXp,
		nextLevelXp: nextLevelXp,
		msgDiscount: levelSchema.msgDiscount,
	};
};
export const addXp = async (userId, serverId, amount) => {
	const levelSchema = await getLevelSchema(userId, serverId);
	const tempLevel = _calculateLevel(levelSchema.xp);
	const tempDiscount = levelSchema.msgDiscount;
	levelSchema.xp += parseInt(amount);
	const newLevel = _calculateLevel(levelSchema.xp);
	const newDiscount = _calculateNewDiscount(newLevel, tempDiscount);
	let discountIncreased = false;
	if (newDiscount > tempDiscount) {
		levelSchema.msgDiscount = newDiscount;
		discountIncreased = true;
	}
	await levelSchema.save().catch((e) => console.log(e));
	return {
		oldLevel: tempLevel,
		newLevel: newLevel,
		newXp: levelSchema.xp,
		discountIncreased: discountIncreased,
		newDiscount: levelSchema.msgDiscount,
	};
};
