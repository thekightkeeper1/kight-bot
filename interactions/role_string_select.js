const { MessageFlags } = require('discord.js');

module.exports = {
    execute: async (interaction) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const member = await fetchMember(interaction);
        if (!member) {
            return interaction.followUp({ content: "Failed to update roles due to an error fetching the member.", ephemeral: true });
        }

        const unselectedRoles = getUnselectedRoles(interaction);
        await removeRoles(member, unselectedRoles);
        await addRoles(interaction, member);

        interaction.followUp({ content: "Successfully updated roles.", ephemeral: true });
    }
};

async function fetchMember(interaction) {
    try {
        return await interaction.guild.members.fetch(interaction.member.id);
    } catch (err) {
        console.error("Failed to fetch member:", err);
        return null;
    }
}

function getUnselectedRoles(interaction) {
    const selectedRoleIds = interaction.values; // Collect all role IDs that were selected by the user
    const actionRow = interaction.message.components.find(row => row.components[0].customId === interaction.customId);
    return actionRow.components[0].options.filter(option => !selectedRoleIds.includes(option.value)); // Filter out roles that were not selected by the user
}

async function removeRoles(member, roles) {
    const rolePromises = roles.map(role => member.roles.remove(role.value));
    await Promise.all(rolePromises);
}

async function addRoles(interaction, member) {
    const rolePromises = interaction.values.filter(roleId => !member.roles.cache.has(roleId)).map(roleId => member.roles.add(roleId));
    await Promise.all(rolePromises);
}
