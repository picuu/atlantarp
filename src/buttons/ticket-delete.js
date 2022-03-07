const Discord = require("discord.js")
const config = require("../config.json")
const ticketsLogsChannelModel = require("../models/ticketsLogs.js")

module.exports = {
    data: {
        name: "ticket-delete"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Only admins and staff can delete tickets!", ephemeral: true });
        
        let logsChannel;
        let data = await ticketsLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
        if (data) {
            logsChannel = await interaction.guild.channels.cache.get(data.channelId)

            logsChannel.send({ content: `A ticket was created but not saved: \`\`${interaction.channel.name}\`\`` })
        }
        
        if (interaction.channel.deletable) {
            
            interaction.reply({ content: "The ticket wasn't saved! Deleting channel..."})
    
            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        }

    }
}