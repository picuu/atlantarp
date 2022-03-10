const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "ticket-claim"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Solo los administradores y staff pueden reclamar tickets!", ephemeral: true });

        interaction.reply({ content: `<@${interaction.member.id}> ha reclamado el ticket.`, allowedMentions: { repliedUser: false } })
    
    }
}