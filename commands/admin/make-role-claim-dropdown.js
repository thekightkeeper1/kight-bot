const {
    SlashCommandBuilder,
    MessageFlags,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require('discord.js')
const {getTextAttachment} = require('../../attachments.js');
const fs = require("node:fs");
const path = require("node:path");
const {v4: uuidv4} = require('uuid');
const {parse} = require("csv");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('make-role-claim-dropdown')
        .setDescription("Generate a dropdown menu full of roles for a user to choose from.")
        .addStringOption(option =>
            option
                .setName('template_name')
                .setDescription("Make dropdowns from a template you have uploaded before.")
        )
        .addAttachmentOption(option =>
            option
                .setName("template_file")
                .setDescription("Upload and save a new template, using it to generate the dropdowns.")
        ),
    execute: async (interaction) => {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        // Seeing if sent us a new template or if we use an existing
        let templateName = "";
        let categories;
        let components;

        // In this case we use the file they uploaded, parse it, then save it.
        if (interaction.options.getAttachment("template_file")) {  //todo ensure we didnt specify both template_file and template_name
            // Fetch the file
            const url = interaction.options.getAttachment("template_file").url;
            const templateText = await getTextAttachment(url);

            /* Saving the file */
            // First ensuring the folder to save to exists
            const guildId = interaction.guildId;
            const templateFolder = `database/${guildId}/make-role-claim-dropdown/templates`;
            if (!fs.existsSync(templateFolder)) {  //todo if it doesnt exist maybe we should make it?
                console.log("The template folder did not exist");
                interaction.editReply({
                    content: "Error: Template folder does not exist",
                })
                console.error("Template folder did not exist")
            }

            // Getting the name of the template from the uploaded attachment
            templateName = templateText.split('\n')[0] + '.txt';
            const templateFP = path.join(process.cwd(), templateFolder, templateName);
            fs.writeFileSync(templateFP, templateText, 'utf8');
            /*
            * template_name
            * multiselect_t/f,category1,opt1,opt2
            * multiselect_t/f,category2,opt1,opt2
            * */
        }

        /* Loading the template file*/
        if (!components) { // If we uploaded a template then this would be defined
            // Reading the template text from the server filesystem
            // Todo make a database code?
            // Loading the file
            templateName = interaction.options.getString("template_name");
            const guildId = interaction.guildId;
            const templateFP = path.join(
                process.cwd(),
                'database',
                guildId,
                'make-role-claim-dropdown',
                "templates",
                templateName + ".csv"
            )

            if (!fs.existsSync(templateFP)) {
                interaction.editReply("I didn't find a template with that name.");
                console.log("There was no template file.");
            }

            // Parsing the csv
            const templateText = fs.readFileSync(templateFP, 'utf8');
            const categories = parseCSV(templateText, interaction);

            components = categories.map()

        }


        interaction.channel.send({
            content: "Choose roles below.",
            components: components,

        })
    }
}


function parseCSV(csvString, interaction) {
    let csvRows = csvString.split('\n');
    csvRows = csvRows.map(s => s.trim().split(','))
    csvRows = csvRows.slice(1)

    let allRolesExist = true;
    const categories = []
    // Object mirroring a string select menu
    csvRows.forEach(record => {
        if (record.length <= 1) return;
        categories.push({
            category: record[2],
            minValues: record[0],
            maxValues: record[1],
            options: record.slice(3).map((s) => {
                // Gets the role ids and outputs errors to the interaction
                const role = interaction.guild.roles.cache.find(r => s === r.name || s === r.id);  // r is a role
                if (!role) {
                    allRolesExist = false;
                    interaction.editReply({
                        content: `${interaction.reply.content}\n The role ${role.name} in the category ${record[2]}`,
                    })
                }
                return role;
                }
            )
        })
    })
    if (!allRolesExist) {
        return [];
    }
    return categories;
}

function templateToActionRows() {

}


