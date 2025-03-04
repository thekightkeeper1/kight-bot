const { ActionRowBuilder, ButtonBuilder, ButtonStyle} = require ('discord.js');

const roles = [
    {
        id: '1328808707689152573',
        label: "pink"
    },{
        id: '1328808481662435338',
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
        if (!interaction.isButton()) return; // TODO do i need this?
        const role = interaction.guild.roles.cache.get(interaction.customId);
        if (!role) {
            console.log(role);
            interaction.editReply({
                content: "I couldn't find any role.",
            })
        } else {
            const member = await interaction.guild.members.fetch(interaction.member.id);
            const hasRole = member.roles.cache.has(role.id);


            if (hasRole) {
                await interaction.member.roles.remove(role);
                interaction.editReply({
                    content: `${role.name} removed.`,
                })
            } else {
                await interaction.member.roles.add(role);
                interaction.editReply({
                    content: `${role.name} added.`,
                })
            }
        }
    }
}



module.exports = {
    RoleButtons: RoleButtons,
}
