const { Client, SlashCommandBuilder, SlashCommandStringOption} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('make-role-claim')
        .setDescription('Make buttons or dropdowns to let users assign roles')
        .addStringOption(new SlashCommandStringOption()
            .setRequired(true)
            .addChoices(["buttons", "dropdowns"])),
    execute: async (interaction) => {
        interaction.reply("Heard.");
    }
}
