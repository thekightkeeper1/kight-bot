const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder
} = require('discord.js');
const {getTextAttachment} = require('../../attachments.js');


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
        await interaction.deferReply();
        const url = interaction.options.getAttachment("template").url;

        if (interaction.options.getString('type') === 'dropdown') {
            await makeDropdowns(interaction);
            return;
        }
        const listOfRoles = (await getTextAttachment(url)).split(',');
        let roleNotExist = false;

        // Verifying the roles all exist
        const roles = [];
        for (const roleName of listOfRoles) {
            roles.push(await interaction.guild.roles.cache.find(r => r.name === roleName));
            // todo how to send multiple ephemeral messages
            if (!roles.at(-1)) {interaction.editReply(`The role ${roleName} does not exist.`); roleNotExist = true;}
        }
        if (roleNotExist) return;

        const messageComponents = makeActionRows(roles);
        if (!messageComponents) {
            interaction.editReply("Something went wrong trying to make buttons. Make sure you gave me a list of comma-separated names")
        }
        interaction.editReply({content: "Here you go", components: messageComponents});

    }
}

function makeActionRows(listOfRoles) {
    const interactionComponents = [
    ]
    let i = 0;
    while (i < listOfRoles.length) {
            if (i >= listOfRoles.length) break;
            if (i % 5 === 0) {
                interactionComponents.push({
                    "type": 1,
                    "components": []}
                );
            }
            interactionComponents.at(-1).components.push(
                {
                    "type": 2,
                    "label": listOfRoles[i].name,
                    "style": 2,
                    "custom_id": `make-role-claim%${listOfRoles[i].id}`,
                }
            );
            i++
    }
    return interactionComponents;
}

function makeButtons(interaction) {}
async function makeDropdowns(interaction) {
    const url = interaction.options.getAttachment("template").url;
    const fileLines = (await getTextAttachment(url)).split('\n');
    const categories = [];

    /* Formatting the json to build categories from */
    // This snippet gets the placeholder, and puts a list of the options into there
    for (let i = 0; i <     fileLines.length; i++) {

        // Gets the names of the roles sanitized
        let rolesNames = fileLines[i].split(',').map(e => e.trim());

        // Gets the name of the category, slices the list of roles so it doesn't include the category name
        const categoryName =  rolesNames[0];
        rolesNames = rolesNames.slice(1);

        // Retrieves roles from the cache, or exists if they do not exist.
        const rolesCached = [];
        for (let roleName of rolesNames) {
            rolesCached.push(interaction.guild.roles.cache.find(r => r.name === roleName));
            // Verify they exist
            if (!rolesCached.at(-1)) {
                await interaction.editReply(`The role ${roleName} does not exist.`);
                return;
            }
        }

        const row = new ActionRowBuilder();
        let componentIdNumber = 0;
        row.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`make-role-claim%${interaction.user.id}%${componentIdNumber++}`)
                .setOptions(rolesCached.map(r => new StringSelectMenuOptionBuilder()
                    .setLabel(r.name)
                    .setValue(r.id)
                )
            )
        )
        categories.push(row.toJSON());
    }


    const foo = new ActionRowBuilder();
    // Adding the dropdowns to the message
    console.log(JSON.stringify(categories));
    interaction.editReply({
        // components: categories.map(e => JSON.stringify(e)),
        components: categories,
        content: "Hopefully this works",
    })
}

