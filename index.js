const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages],
});

const { token } = require('./config.json');

client.on('ready', () => {
    console.log(`Bot is logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!av')) {
        const args = message.content.split(' ');

        if (!args[1]) {
            return message.reply('Please provide a user ID.');
        }

        const userId = args[1];

        try {
            const user = await client.users.fetch(userId);

            const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });
            const avatarEmbed = new EmbedBuilder()
                .setTitle(`Avatar for ${user.tag}`)
                .setImage(avatarUrl)
                .setColor('Random');

            await message.channel.send({ embeds: [avatarEmbed] });

            const userWithBanner = await client.users.fetch(userId, { force: true });
            if (userWithBanner.banner) {
                const bannerUrl = userWithBanner.bannerURL({ size: 1024, dynamic: true });
                const bannerEmbed = new EmbedBuilder()
                 // .setTitle(`Banner for ${user.tag}`)
                    .setImage(bannerUrl)
                    .setColor('Random');

                await message.channel.send({ embeds: [bannerEmbed] });
            } else {
                message.reply('This user does not have a banner.');
            }
        } catch (error) {
            console.error(error);
            message.reply('An error occurred or the user could not be found.');
        }
    }
});

client.login(token);
