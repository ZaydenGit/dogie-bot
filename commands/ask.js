const { Configuration, OpenAIApi } = require('openai')
const cfg = new Configuration({
	apiKey: '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',
})
module.exports = {
	name: 'ask',
	description: 'ask dogie a question :P',
	aliases: ['question'],
	hidden: false,
	async execute(client, message, args) {
		console.log(args.join(' '))
		// const msgRef = message.reply('thinking...')
		try {
			const openai = new OpenAIApi(cfg)
			const completion = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: args.join(' '),
				max_tokens: 2048,
				n: 1,
				stop: null,
				temperature: 0.7,
			})
			let text = completion.data.choices[0].text.trim()
			console.log(`>${text}`)
			while (text != '') {
				message.reply(text.slice(0, 2000))
				text = text.slice(2000)
			}
			// message.reply(completion.data.choices[0].text.trim(), { split: true })
		} catch (error) {
			console.log(error)
			message.reply('openai encountered an error (prolly overloaded servers) :((( try later :((((')
		}
	},
}
