const mongo = require('mongoose')

const levelSchema = mongo.Schema({
	xp: Number,
	msgDiscount: Number,
	shopDiscount: Number,
	userId: String,
	serverId: Number,
})

module.exports = mongo.model('Level', levelSchema)
