export const parseUserAndAmount = (message, args) => {
	let targetUser = message.mentions.users.first();
	let remainingArgs = [...args];
	if (targetUser) remainingArgs = remainingArgs.filter((arg) => !arg.includes(`<@${targetUser.id}>`));
	else targetUser = message.author;
	const amount = remainingArgs[0] || null;
	return { targetUser, amount };
};
