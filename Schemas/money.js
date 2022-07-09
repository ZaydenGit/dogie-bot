const mongoose = require('mongoose')

const moneySchema = mongoose.Schema({
	userId: String,
	serverId: String,
	money: Number,
})

module.exports = mongoose.model('Money', moneySchema)
