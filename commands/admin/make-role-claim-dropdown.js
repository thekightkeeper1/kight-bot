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
        let templateName = "";
        let templateText;

        if (interaction.options.getAttachment("template_file")) {  //todo ensure we didnt specify both template_file and template_name
            // Fetch the file
            const url = interaction.options.getAttachment("template_file").url;
            templateText = await getTextAttachment(url);

            /* Saving the file */
            // First ensuring the folder to save to exists
            const guildId = interaction.guildId;
            const templateFolder = `database/${guildId}/make-role-claim-dropdown/templates`;
            if (!fs.existsSync(templateFolder)) {  //todo if it doesnt exist maybe we should make it?
                console.log("The template folder did not exist");
                interaction.editReply({
                    content: "There was an error",
                })
            }


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
        if (!templateText) { // If we uploaded a template then this would be defined
            // Reading the template text from the server filesystem
            // Todo make a database code?
            templateName = interaction.options.getString("template_name");
            const guildId = interaction.guildId;
            const templateFP = path.join(
                process.cwd(),
                'database',
                guildId,
                'make-role-claim-dropdown',
                "templates",
                templateName + ".txt"
            )
            if (!fs.existsSync(templateFP)) {
                interaction.editReply("There was an error");
                console.log("There was no template file.");
            }
            templateText = fs.readFileSync(templateFP, 'utf8');
        }

        /* Parsing the file */
        const templateLines = templateText.split("\n").map(line => line.split(','));
        const components = [];
        let allRolesExist = true;
        templateLines.slice(1).forEach((line) => {
                const options = line.slice(2);
                const maxSelected = line[0] === "t" ? options.length : 1;
                const category = line[1];

                // Ensuring the roles in the template actually exist
                const roles = options.map((s) => { // S is a string, hopefully representing a value role name/id
                  const role = interaction.guild.roles.cache.find(r => s === r.name || s === r.id);  // r is a role
                  if (!role) {
                      allRolesExist = false;
                      interaction.editReply({
                          content: `${interaction.reply.content}\n The role ${role.name} in the category ${category}`,
                      })
                  }
                  return role;
                })
                if (!allRolesExist) {return;}
                const row = new ActionRowBuilder();

                row.addComponents(
                    new StringSelectMenuBuilder()
                        .setOptions(roles.map(role => new StringSelectMenuOptionBuilder()
                            .setLabel(role.name)
                            .setValue(role.id)
                        ))
                        .setMaxValues(maxSelected)
                        .setPlaceholder(category)
                        .setCustomId(uuidv4())
                )
                components.push(row);
            }
        )

        interaction.channel.send({
            content: "Choose roles below.",
            components: components,

        })
    }
}
