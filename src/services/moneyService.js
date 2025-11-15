import Money from "../Schemas/money.js";

export const getMoneySchema = async (userId, serverId) => {
	let moneySchema = await Money.findOne({
		userId: userId,
		serverId: serverId,
	});
	if (!moneySchema) {
		moneySchema = await new Money({
			userId: userId,
			serverId: serverId,
			money: 0,
		})
			.save()
			.catch((e) => console.log(e));
	}
	return moneySchema;
};

export const getBalance = async (userId, serverId) => {
	const moneySchema = await getMoneySchema(userId, serverId);
	return moneySchema.money;
};

export const setMoney = async (userId, serverId, amount) => {
	const moneySchema = await getMoneySchema(userId, serverId);
	moneySchema.money = parseInt(amount);
	await moneySchema.save().catch((e) => console.log(e));
	return moneySchema.money;
};

export const addMoney = async (userId, serverId, amount) => {
	const moneySchema = await getMoneySchema(userId, serverId);
	moneySchema.money += parseInt(amount);
	await moneySchema.save().catch((e) => console.log(e));
	return moneySchema.money;
};

export const removeMoney = async (userId, serverId, amount) => {
	const moneySchema = await getMoneySchema(userId, serverId);
	moneySchema.money -= parseInt(amount);
	await moneySchema.save().catch((e) => console.log(e));
	return moneySchema.money;
};
