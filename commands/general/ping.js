const {SlashCommandBuilder} = require('discord.js');

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
        let numPings = interaction.options.getInteger("num_pings") - 1;
        if (!numPings) numPings = 0;
        interaction.reply('Pong!' + "\nPong!".repeat(numPings));
    }
};