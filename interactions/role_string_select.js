const {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, Message} = require('discord.js');


module.exports = {
    execute: async (interaction) => {

        /*
        *
        * To verify:
        * role exist
        * todo role not admin role
        * todo bot has permisions
        *
        * */

        await interaction.deferReply({flags: MessageFlags.Ephemeral})

        // Getting all the unselected roles to remove them from the user.
        const unselectedRoleOptions = getUnselectedRoles(interaction);
        const member = await interaction.guild.members.fetch(interaction.member.id);
        const rolesModified = [];
        for (let role of unselectedRoleOptions) {
            const hasRole = member.roles.cache.has(role.value);
            if (hasRole) {
                rolesModified.push(interaction.member.roles.remove(role.value));
            }
        }

        // And then adding their new roles
        for (let roleId of interaction.values) {
            const hasRole = member.roles.cache.has(roleId)
            if (hasRole) continue;
            rolesModifiede.push(interaction.member.roles.add(roleId));
        }

        Promise.all(rolesModified).then(() => {
            interaction.reply("Successfully updated roles.");
        })

    }
}

function getUnselectedRoles(interaction) {
    const selectedRoles = interaction.values;
    const actionRow = interaction.message.components.find(actionRow => actionRow.components[0].customId === interaction.customId);
    return actionRow.components[0].options.filter(option => !selectedRoles.includes(option.value));
}
