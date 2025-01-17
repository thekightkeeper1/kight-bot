const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction} = require ('discord.js');

const roles = [
    {
        id: '1328808481662435338',
        label: "pink"
    },{
        id: '1328808707689152573',
        label: "green"
    },{
        id: '1328808733706293419',
        label: "teal"
    }
    ]


class RoleButtons {
    constructor(client) {
        this.client = client;
    }
    async makeButtons() {
        try {
            const channel = await this.client.channels.fetch('1328810772016533534');
            if (!channel) return;
            const row = new ActionRowBuilder()
                .addComponents(
                    roles.map(role =>
                            new ButtonBuilder()
                                .setCustomId(role.id)
                                .setLabel(role.label)
                                .setStyle(ButtonStyle.Primary)
                    )
                )
                channel.send({
                    content: 'Claim or remove a role',
                    components: [row],
                })
                console.log("I tried to make the buttons");
        } catch (error) {
            console.log(error);
        }
        console.log("Buttons created (successfully?).");

    }

    static isThis(customId) {
        for (let role of roles) {
            if (customId === role.id) return true;
        }
        return false;
    }

    static async execute(interaction) {
        if (!interaction.isButton()) return;
        const role = interaction.guild.roles.cache.get(Number(interaction.customId));
        console.log(interaction.guild.roles.cache)
        if (!role) {
            interaction.editReply({
                content: "I couldn't find any role.",
            })
        }
    }
}



module.exports = {
    RoleButtons: RoleButtons,
}
