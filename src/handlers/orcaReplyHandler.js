import { AttachmentBuilder } from "discord.js";
import between from "../utils/between.js";

const orcaText = [
	"i love orcas",
	"orcas are my favourite",
	"orca enjoyer",
	"look at this cool orca",
	"bro  he is so cool (what a cool orca!)",
	"love this guy (he is an orca)",
	"look at him go",
	"oh naw! look at him go",
	'talk about a "what the heck" moment!',
];

export const checkOrca = async (client, message) => {
	const messageContent = message.content.toLowerCase().split(" ");
	if (messageContent.includes("orca") || messageContent.includes("orcas")) {
		const orcaImages = client.orcaImages;
		if (!orcaImages || orcaImages.length === 0) return;
		try {
			const fileUrl = orcaImages[Math.floor(between(0, orcaImages.length))];
			const attachment = new AttachmentBuilder(fileUrl, { name: fileUrl.split("/").pop().split("?")[0] });
			const text = orcaText[Math.floor(between(0, orcaText.length))];
			await message.reply({ content: text, files: [attachment] });
		} catch (err) {
			console.error("Couldn't send orca image:", err);
		}
	}
};
