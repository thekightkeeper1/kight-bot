module.exports = {
    replyOrEdit: (interaction, text) => {
        if (interaction.replied || interaction.deferred) {
            interaction.followUp({content: text});
        } else {
            interaction.reply({content: text});
        }
    }
}