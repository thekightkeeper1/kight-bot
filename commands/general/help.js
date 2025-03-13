const {SlashCommandBuilder, MessageFlags, AttachmentBuilder, } = require('discord.js');

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Prints information about a command')
            .addStringOption(option =>
            option
                .setName("command")
                .setDescription("The command you want info on.")
                .setRequired(true)
            ),

    execute: (interaction) => {
        const helpText =  interaction.client.commands.get(interaction.options.getString("command")).help;
        interaction.reply({
            content: helpText,
            files: [new AttachmentBuilder("template.csv")]
        })
    },

    help: "Enter the name of a command to see its help text. Cases sensitive",
};