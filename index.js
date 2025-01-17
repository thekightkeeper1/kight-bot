require('dotenv').config();
const {
    Client,
    IntentsBitField,
    REST,
    ApplicationCommandOptionType,
    Routes,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const {RoleButtons} = require('./channel_utils/role_buttons');
const {ping} = require("./ping");
const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN);

const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMessages,
        // IntentsBitField.Flags.GuildChannels
    ]
})

const buttons = new RoleButtons(client);

client.on('ready', () => {
    console.log('Ready!');
    buttons.makeButtons();
})

client.on('interactionCreate', async (interaction) =>  {
    if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case 'ping':
                interaction.reply({content: "Pong!"});
                break;
            case 'dropdown':
                const select = new StringSelectMenuBuilder()
                    .setCustomId('tmp')
                    .setPlaceholder('Category Name')
                    .addOptions(...optionsGenerator());
                const row = new ActionRowBuilder()
                    .addComponents(select);


                interaction.reply({
                    content: 'This is the message?',
                    components: [row],
                })
                break;
            default:
                break;
        }
    } else if (interaction.isButton()) {
        await interaction.deferReply({ephemeral: true});

        if (RoleButtons.isThis(interaction.customId)) {
            RoleButtons.execute(interaction);
        }

    }
})


/* Registering Commands */
const commands = [
    ping,

    {
        name: 'dropdown_help',
        description: 'Sends you an example of how to use drop down formatting',
    },
    {
        name: 'admin_only',
        description: 'Can only be used by admins',
        defaultMemberPermissions: 0,

    }

]


async function registerCommands() {
    try {
        console.log('Registering commands');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        )
        console.log("Commands registered without error.");
    } catch (error) {
        console.log(`Error when registering commands. Check command naming convention and/or the tokens: ${error}`);
    }
}

registerCommands();

client.login(process.env.DISCORD_TOKEN);


function optionsGenerator() {
    let options = []
    for (let i = 0; i < 3; i++) {
        options.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(`opt${i}`)
                .setDescription('This is the second option')
                .setValue(i.toString())
        )
    }
    return options;
}


