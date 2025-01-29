require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
    Client,
    REST,
    Collection,
    IntentsBitField,
    Events
} = require('discord.js');

const {RoleButtons} = require('./channel_utils/role_buttons');
const {InteractionCreate} = require("node:events");
const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

        // IntentsBitField.Flags.GuildChannels
    ]
});
client.commands = new Collection();

/*
* Getting the commands
* */

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            throw Error(`Command ${file} missing required "data" or "execute" property`);
        }
    }
}

const buttons = new RoleButtons(client);

client.once(Events.ClientReady, () => {
    console.log('Ready!');
})

// Role button interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        await interaction.deferReply({ephemeral: true});
        if (RoleButtons.isThis(interaction.customId)) {
            const role = interaction.guild.roles.cache.get(interaction.customId);
            await RoleButtons.execute(interaction);
        }
    }
})

// Handling slash commands
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
})


client.login(process.env.DISCORD_TOKEN);


