const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, Message} = require ('discord.js');



module.exports = {
    execute: async (interaction) => {
        // The user must exist
        // the role must exist
        // the role must not give admin permissions
        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        // Getting all the unselected roles to remove them from the user.
        getUnselectedRoles(interaction);


        let role = interaction.guild.roles.cache.find(r => r.id === interaction.values[0])

        if (!role) {
            console.log(role);
            interaction.editReply({
                content: "I couldn't find any role. Maybe you clicked on an outdated interaction menu.",
            })
            console.log(interaction.values[0])
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

function getUnselectedRoles(interaction) {
    let selectMenu = interaction.message.components.find(actionRow => actionRow.components[0].customId === interaction.customId);
    let roles = selectMenu.options.map(role => role);

    return roles
}
