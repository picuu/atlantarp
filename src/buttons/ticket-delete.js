const Discord = require("discord.js")
const config = require("../config.json")
const ticketsLogsChannelModel = require("../models/ticketsLogs.js")

module.exports = {
    data: {
        name: "ticket-delete"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Solo los administradores y staff pueden eliminar tickets!", ephemeral: true });
        
        let logsChannel;
        let data = await ticketsLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
        if (data) {
            logsChannel = await interaction.guild.channels.cache.get(data.channelId)

            logsChannel.send({ content: `Se ha cerrado un ticket, pero no se ha guardado: \`\`${interaction.channel.name}\`\`` })
        }
        
        if (interaction.channel.deletable) {
            
            interaction.reply({ content: "El ticket no se ha guardado. Eliminando canal..."})
    
            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        }

    }
}