const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags} = require ('discord.js');



module.exports = {
    execute: async (interaction) => {
        // The user must exist
        // the role must exist
        // the role must not give admin permissions
        await interaction.deferReply()
        let role = interaction.guild.roles.cache.has(interaction.valueOf())

        // const role = interaction.guild.roles.cache.get(interaction.valueOf()); // valueOf() expected to be a roleid
        if (!role) {
            console.log(role);
            interaction.editReply({
                content: "I couldn't find any role. Maybe you clicked on an outdated interaction menu.",
            })
            console.log(interaction.valueOf())
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
