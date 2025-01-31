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
        let templateJSON;

        // Catching errors with json and maybe something wrong with fetching the attachment
        const templateText = await getTextAttachment(url);
        try {
            templateJSON = JSON.parse(templateText);
        } catch (error) {
            if (error instanceof SyntaxError)  {
                interaction.editReply("The JSON was not valid JSON format.");
            } else throw error;
            return;
        }

        const messageComponents = makeActionRows(templateJSON);
        if (!messageComponents) {
            interaction.editReply("Something went wrong trying to make buttons. Make sure you gave me a list of comma-separated roles.")
        }
        interaction.editReply("Done!");

    }
}

function makeActionRows(listOfRoles) {
    interactionComponents = [
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
                    "label": listOfRoles[i],
                    "style": 2,
                    "custom_id": "make-role-claim"
                }
            );
            i++
    }
    return interactionComponents;
}
