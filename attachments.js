const { https } = require('https');
// const fetch = require('node-fetch');
const { replyOrEdit } = require('./utils.js');
module.exports = {
    getTextAttachment: async (interaction, url) => {
        try {
            // fetch the file from the external URL
            const response = await https.get(url);
            console.log(response);

            // If there was an error send a message with the status
            replyOrEdit(interaction, "Failed to fetch the attachment.");

            // take the response stream and read it to completion
            const text = await response.text();
            console.log(text);
        } catch (error) {
            console.error(error);
            return "error";
        }
    }

}