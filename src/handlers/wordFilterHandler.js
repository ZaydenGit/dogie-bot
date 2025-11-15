import config from "../../config.json" with { type: "json" };
import { getWordOfTheDay } from "../utils/wordOfTheDay.js";
import sendTempMessage from "../utils/sendTempMessage.js";

export const checkWordFilter = async (message) => {
    if (config.channels.wordFilterOff.includes(message.channel.id)) return false;

    const filteredWord = getWordOfTheDay().toLowerCase()
    if (!filteredWord) return false;
    const messageContent = message.content.toLowerCase().split(" ");

    for (let word of messageContent) {
        word = word.replace(/[*_~`>|]/g, "").toLowerCase();
        const index = word.indexOf(filteredWord);
        if (index === -1) continue;
        const highlighted = word !== filteredWord
            ? word.slice(0, index) + "**" + word.slice(index, index + filteredWord.length) + "**" + word.slice(index + filteredWord.length)
            : "";
        await message.delete();
        sendTempMessage(`BRO DO NOT SAY ${getWordOfTheDay().toUpperCase()}`+(highlighted ? ` (${highlighted})` : ""), message, 10000);
        return true;
    }
    return false;
}

