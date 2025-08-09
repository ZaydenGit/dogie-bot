import { model, Schema } from "mongoose";

const levelSchema = Schema({
	xp: Number,
	msgDiscount: Number,
	shopDiscount: Number,
	userId: { type: String, unique: true, required: true },
	serverId: Number,
});

export default model("Level", levelSchema);
