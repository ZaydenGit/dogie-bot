import { model, Schema } from "mongoose";

const moneySchema = Schema({
	userId: { type: String, unique: true, required: true },
	serverId: String,
	money: Number,
});

export default model("Money", moneySchema);
