const { Configuration, OpenAIApi } = require('openai')
const cfg = new Configuration({
	apiKey: process.env.OPENAI_APIKEY,
})

module.exports = {
	name: 'ask',
	description: 'ask dogie a question :P',
	aliases: ['question'],
	hidden: false,
	async execute(client, message, args) {
		console.log(args.join(' '))
		try {
			// API CALL
			const openai = new OpenAIApi(cfg)
			const completion = await openai.createCompletion({
				model: 'text-davinci-003',
				max_tokens: 2048,
				// n: 1,
				// stop: null,
				temperature: 0.5,
				prompt: args.join(' '),
			})

			//SPLIT INTO MULTIPLE MESSAGES > 2000 CHARS
			let text = completion.data.choices[0].text.trim()
			while (text != '') {
				message.reply(text.slice(0, 2000))
				text = text.slice(2000)
			}
		} catch (error) {
			console.log(error)
			return await message.reply(`Request failed with code **${error.response.status}**`)
		}
	},
}
