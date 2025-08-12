import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const PHRASE_REGEX = /\bkill\W*zayden\b/i;

client.on("messageCreate", async (message) => {
  try {
    if (!message.guild || message.author.bot) return;

    if (!PHRASE_REGEX.test(message.content)) return;

    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
    if (!member) return;

    const botMe = message.guild.members.me;
    if (
      !botMe?.permissions.has(PermissionsBitField.Flags.ModerateMembers) ||
      !member.moderatable
    )

    await member.timeout(5 * 60 * 1000, 'Auto-timeout: prohibited phrase detected');


    await message.reply("You have been timed out for 5 minutes for violent language.");
  } catch (err) {
    console.error("Timeout handler error:", err);
  }
});

client.login(process.env.BOT_TOKEN);
