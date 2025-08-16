const sendTempMessage = async (content, message, TIMEOUT_MS = 5000) => {
	try {
		return await message.channel.send(content).then((msg) => setTimeout(() => msg.delete(), TIMEOUT_MS));
	} catch (err) {
		console.error(err);
	}
};
export default sendTempMessage;
