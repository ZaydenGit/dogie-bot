const sendTempMessage = async (content, message, TIMEOUT_MS = 5000) => {
	return await message.channel.send(content).then((msg) => setTimeout(() => msg.delete(), TIMEOUT_MS));
};
export default sendTempMessage;
