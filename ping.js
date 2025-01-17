const { ApplicationCommandOptionType } = require('discord.js');
const ping = {
    name: 'ping',
    description: 'Replies with pong!',
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'num_pings',
            description: 'Number of times pong is sent',
            required: false,
            max_value: 3,
        },
    ],
}

module.exports = {
    ping: ping
};