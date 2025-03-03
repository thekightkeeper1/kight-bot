const {
    SlashCommandBuilder
} = require('discord.js')
const {getTextAttachment} = require('../../attachments.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('make-role-claim-dropdown')
        .setDescription("Generate a dropdown menu full of roles for a user to choose from.")
        .addStringOption(option =>
        option
            .setName('templateName')
            .setDescription("Make dropdowns from a template you have uploaded before.")
        )
        .addAttachmentOption(option =>
            option
                .setName("templateFile")
                .setDescription("Upload and save a new template, using it to generate the dropdowns.")
        ),
    execute: async (interaction) => {

        await interaction.deferReply();


        if (interaction.options.getString("templateName")) {
            // todo
        } else if (interaction.options.getAttachment("templateFile")) {
            const url = interaction.options.getAttachment("templateFile").url;
            const fileLines = (await getTextAttachment(url)).split('\n');

            /*
            * template_name
            * multiselect_t/f category1 opt1 opt2
            * multiselect_t/f category2 opt1 opt2
            * */
            // Parsing the template
            // Generating action rows and acdding buttons
        }
        await interaction.reply({
            content: ""
        })
    }
}