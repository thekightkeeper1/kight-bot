const {SlashCommandBuilder} = require('discord.js');
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
        return;
        if (templateText === "error") return;  // TODO Replying to error is handled by getTextAttachment
        try {
            const templateJSON = JSON.parse(templateText);
            if (!validateTemplate(templateJSON)) {
                interaction.reply("There was an error in the fields");
                return;
            }
        } catch (error) {
            console.log(error);
            interaction.reply("The json was not valid.");
            return;
        }
        interaction.reply("Done!");
        console.log("test");
    }
}

function validateTemplate(json) {

     for (let item of json) {
         if (item.name.includes(' ')) {

         }
     }
     return json;
}
