const mongo = require('mongoose')

const emoteSchema = mongo.Schema({
	id: { type: String, unique: true, required: true },
	name: String,
	rarity: { type: String, default: '' },
	blacklisted: { type: Boolean, default: false },
})

module.exports = mongo.model('Emote', emoteSchema)
