import { model, Schema } from "mongoose";

const messageSchema = new Schema({
	userId: { type: String, unique: true, required: true },
	messages: Number,
});

export default model("messages", messageSchema);
