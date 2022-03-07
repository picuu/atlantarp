const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "ticket-claim"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Only admins and staff can claim tickets!", ephemeral: true });

        interaction.reply({ content: `<@${interaction.member.id}> claimed the ticket.`, allowedMentions: { repliedUser: false } })
    
    }
}