const { ApplicationCommandOptionType, SlashCommandBuilder, SlashCommandIntegerOption} = require('discord.js');
const ping = {
    name: 'ping',
    description: 'Replies with pong!',
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'num_pings',
            description: 'Number of times pong is sent',
            required: false,
            max_value: 3,
        },
    ],
}

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong!')
            .addIntegerOption(option =>
                option.setName('num_pings')
                    .setDescription('Number of time to send pong')
            )
    ,
    execute: (interaction) => {
        interaction.reply('Pong!');
    }
};