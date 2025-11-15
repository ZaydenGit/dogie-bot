const cooldowns = new Map();

export const checkCooldown = (commandName, userId, cooldownMs) => {
	const now = Date.now();
	const key = `${commandName}-${userId}`;
	const lastUsed = cooldowns.get(key) || 0;

	if (lastUsed && now - lastUsed < cooldownMs) {
		const timeLeft = cooldownMs - (now - lastUsed) / 1000;
		return Math.ceil(timeLeft);
	} else {
		cooldowns.set(key, now);
		setTimeout(() => cooldowns.delete(key), cooldownMs);
		return 0;
	}
};
