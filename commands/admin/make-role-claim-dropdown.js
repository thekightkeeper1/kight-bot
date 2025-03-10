const {
    SlashCommandBuilder,
    MessageFlags,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder, SelectMenuOptionBuilder,
} = require('discord.js')
const {getTextAttachment} = require('../../attachments.js');
const fs = require("node:fs");
const path = require("node:path");
const {v4: uuidv4} = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('make-role-claim-dropdown')
        .setDescription("Generate a dropdown menu full of roles for a user to choose from.")
        .addStringOption(option =>
            option
                .setName('template_name')
                .setDescription("Make dropdowns from a template you have uploaded before.")
                .setRequired(true)
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

        const guildId = interaction.guildId;
        const templateName = interaction.options.getString("template_name");
        const templateFolder = `database/${guildId}/make-role-claim-dropdown/templates`;
        if (!fs.existsSync(templateFolder)) {  //todo if it doesnt exist maybe we should make it?
            console.log("The template folder did not exist");
            interaction.followUp({
                content: "Error: Template folder does not exist. Ask the dev to (re)register your server",
            })
        }

        const templateSaveDir = path.join(templateFolder, templateName + ".json");

        // Seeing if sent us a new template or if we use an existing
        let components;
        if (interaction.options.getAttachment("template_file")) {
            // In this case we use the file they uploaded, parse it, then save it.
            // Fetch the file
            const attachmentURL = interaction.options.getAttachment("template_file").url;
            const templateText = await getTextAttachment(attachmentURL);


            // parsing the template
            components = parseCSV(templateText, interaction)
            if (!components) {
                interaction.followUp({
                    content: "I ran into an issue parsing the csv.",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            fs.writeFile(templateSaveDir, JSON.stringify(components), (err) => {
                if (!err) return;
                console.error(err);
                interaction.followUp({
                    content: "There was an issue saving the file to my database. Please contact the developer.",
                    flags: MessageFlags.Ephemeral
                })
            })
            return;
        }

        /* Loading the template file*/
        if (!components) { // If we uploaded a template then this would be defined

            // Loading template
            if (!fs.existsSync(templateSaveDir)) {
                interaction.editReply("I didn't find a template with that name.");
                console.log(`There was no template file ${templateName}.`);
            }

            // Parsing the csv
            components = JSON.parse(fs.readFileSync(templateSaveDir, 'utf8'));
        }

        actionRow[0] = (new StringSelectMenuBuilder()
                .setCustomId("replace_this_when_executing")
                .setPlaceholder(record[columns.placeholder])
                .setMaxValues(+record[columns.maxValues])
                .setMinValues(+record[columns.minValues])
        )

        return;
        // Generating uuid for the custom id
        components = components.map(actionRow => new ActionRowBuilder()
            .addComponents([
                new StringSelectMenuBuilder(actionRow.components[0])
                    .setCustomId(uuidv4())
            ])
        )

        interaction.channel.send({
            content: "Choose roles below.",
            components: components,
        })
    }
}


function parseCSV(csvString, interaction) {
    let csvRows = csvString.split('\n');
    csvRows = csvRows.map(s => s.trim().split(','))

    // Gets indices of column
    const columns = {
        maxValues: "MAX_OPT",
        minValues: "MIN_OPT",
        placeholder: "CAT_NAME",
        roles: "ROLES"
    };

    Object.keys(columns).forEach(key => {
        columns[key] = csvRows[0].indexOf(columns[key]);
    });
    csvRows = csvRows.slice(1);


    let allRolesExist = true;
    let errors = "These roles were not found in your server:";
    const components = [];  // This is what is sent in interaction.reply({components: components})
    csvRows.forEach(record => {
        if ("" === record[0]) return;
        if (record.length < columns.roles + 1) {
            interaction.followUp({
                content: "This row didn't have at least" + columns.roles + " items in it:" +
                    "\n```js\n" + record + "\n```"

            })
        }
        components.push(new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
                .setCustomId("replace_this_when_executing")
                .setPlaceholder(record[columns.placeholder])
                .setMaxValues(+record[columns.maxValues])
                .setMinValues(+record[columns.minValues])
                .setOptions(record.slice(columns.roles).map(s => {
                    if (s === "") return;
                    const role = interaction.guild.roles.cache.find(r => s === r.name || s === r.id);  // r is a role
                    if (!role) {
                        errors += `category: ${record[2]} role: ${s}`;
                        allRolesExist = false;
                        return;
                    }
                    return new StringSelectMenuOptionBuilder()
                        .setValue(role.id)
                        .setLabel(role.name)
                    }
                ).filter(e => e != null))
        ]))
    })
    if (!allRolesExist)
        return null;
    if (!components.length) {
        interaction.followUp({
            content: "It looked like there was no CSV data" +
                " (Or the file format was wrong.):" +
                " \n ```\n" +  csvString + "\n```",
            flags: MessageFlags.Ephemeral
        })
    }

    return components;

}


