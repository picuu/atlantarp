const Discord = require("discord.js")
const config = require("../config.json")
const ticketsLogsChannelModel = require("../models/ticketsLogs.js")
const { createTranscript } = require("discord-html-transcripts")
const moment = require("moment")


module.exports = {
    data: {
        name: "ticket-save"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Only admins and staff can save tickets!", ephemeral: true });
        
        let date = moment().format("YYMMDD");

        const attachment = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${date}-${interaction.channel.name}.html`
        })

        let logsChannel;
        let data = await ticketsLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
        if (data) {
            logsChannel = await interaction.guild.channels.cache.get(data.channelId)

            logsChannel.send({ content: `**NEW TICKET LOG**\n${date}-${interaction.channel.name}`, files: [attachment] })
        }

        if (interaction.channel.deletable) {
            
            interaction.reply({ content: "Ticket saved successfully! Deleting channel..."})

            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        }
    
    }
}