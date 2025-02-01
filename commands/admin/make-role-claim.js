const {SlashCommandBuilder} = require('discord.js');
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
        interaction.deferReply();
        const url = interaction.options.getAttachment("template").url;

        // Catching errors with json and maybe something wrong with fetching the attachment
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
