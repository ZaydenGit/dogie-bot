import { model, Schema } from "mongoose";

const emoteSchema = Schema({
	id: { type: String, unique: true, required: true },
	name: String,
	rarity: { type: String, default: "" },
	blacklisted: { type: Boolean, default: false },
});

export default model("Emote", emoteSchema);
