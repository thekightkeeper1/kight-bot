const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('make-role-claim')
        .setDescription('Make buttons or dropdowns to let users assign roles')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type of interaction to use.')
                .setRequired(true)
                .addChoices(
            {name: "Buttons", value: "button"},
                    {name: "Dropdowns", value: "dropdown"})
        )
        .addAttachmentOption(option =>
            option
                .setName('template')
                .setDescription('Template to make the interactions from.')
                .setRequired(true)
        ),
    execute: async (interaction) => {

        interaction.reply("Done");
        console.log("test");
    }
}
