const {SlashCommandBuilder, ActionRowBuilder} = require('discord.js');
const {getTextAttachment} = require('../../attachments.js');
const https = require('https');

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
        console.log(url);
        const templateText = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data)
                });
            }).on('error', (err) => {
                reject(err)
            });
        })
        console.log(templateText);
        if (templateText === "error") return;  // TODO Replying to error is handled by getTextAttachment
        try {
            const templateJSON = JSON.parse(templateText);
            interaction.editReply({
                content: "hi"
            })
        } catch (error) {
            console.log(error);
            interaction.editReply("The json was not valid.");
            return;
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

