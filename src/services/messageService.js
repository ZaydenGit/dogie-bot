import Messages from "../Schemas/messages.js";
import { getLevelSchema } from "./levelService.js";
import between from "../utils/between.js";
import dogielist from "../data/dogies.json" with { type: "json" };
const dogies = dogielist.dogielist.filter(Boolean);  

export const getMessageSchema = async (userId) => {
    let messageSchema = await Messages.findOne({ userId });
    if (!messageSchema) {
        messageSchema = await new Messages({ userId, messages:0 })
        await messageSchema.save()
            .catch((e) => console.log(e));
    }
    return messageSchema;
}

export const incrementMessageCount = async (userId, serverId) => {
    const [messageSchema, levelSchema] = await Promise.all([
        getMessageSchema(userId),
        getLevelSchema(userId, serverId)
    ]);
    messageSchema.messages += 1;
    const requiredMessages = 50 - levelSchema.msgDiscount;

    let dogieSpawn = null;

    if (messageSchema.messages >= requiredMessages) {
        messageSchema.messages = 0
        const date = new Date().toLocaleString("en-US", { timezone: "America/Los_Angeles", weekday: "short" });
		const isMonday = date === "Mon";
		const dogieIndex = Math.round(between(0, dogies.length));
		const dogieName = dogies[dogieIndex];
		const dogieValue = Math.floor(
			25 * Math.round(6.488 * dogieIndex * (0.2 * dogieIndex) + 20) * (isMonday ? 1.25 : 1)
		);
		
		dogieSpawn = {
			name: dogieName,
			value: dogieValue,
			isMonday: isMonday,
		};
    }

    await messageSchema.save().catch((e) => console.log(e));

    return {
        newMessageCount: messageSchema.messages,
        dogieSpawn: dogieSpawn || null,
    };
};