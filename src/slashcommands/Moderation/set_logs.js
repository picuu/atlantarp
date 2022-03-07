const { SlashCommandBuilder } = require("@discordjs/builders")
const joinsLogsChannelModel = require("../../models/joinsLogs.js")
const ticketsLogsChannelModel = require("../../models/ticketsLogs.js")
const bansLogsChannelModel = require("../../models/bansLogs.js")

module.exports = {
    name: "setjoinslogs",
    data: new SlashCommandBuilder()
        .setName("set_logs")
        .setDescription("Set the current channel for the logs of joins and leaves.")
        // .addStringOption(option => option.setName("type").setDescription("The type of logs you want to set.")
        //     .addChoice("Moderation logs", "mod-logs")
        //     .addChoice("Information", "info")
        //     .setRequired(true))
        .addStringOption(option => option.setName("log").setDescription("The logs you want to set in this channel.")
            .addChoice("Joins and Leaves", "joins-leaves")
            .addChoice("Tickets", "tickets")
            .addChoice("Kicks, Bans and Timeouts", "kicks-bans-timeouts")
            .setRequired(true)),

    async run(client, interaction) {

        // interaction.deferReply({ ephemeral: true })

        // const type = interaction.options.getString("type")

        const logType = interaction.options.getString("log")
       
        switch (logType) {
            case "joins-leaves":

                let joinsLogsChannelData = await joinsLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
                if (!joinsLogsChannelData) {
                    let newJoinsLogsChannelData = new joinsLogsChannelModel({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                    await newJoinsLogsChannelData.save()
                } else {
                    await joinsLogsChannelModel.findOneAndUpdate({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                }
        
                interaction.reply({ content: "The channel has been set to be the **Joins Logs Channel**", ephemeral: true })
                
                break;
        
            case "tickets":

                let ticketsLogsChannelData = await ticketsLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
                if (!ticketsLogsChannelData) {
                    let newTicketsLogsChannelData = new ticketsLogsChannelModel({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                    await newTicketsLogsChannelData.save()
                } else {
                    await ticketsLogsChannelModel.findOneAndUpdate({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                }
        
                interaction.reply({ content: "The channel has been set to be the **Tickets Logs Channel**", ephemeral: true })

                break;

            case "kicks-bans-timeouts":

                let bansLogsChannelData = await bansLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
                if (!bansLogsChannelData) {
                    let newBansLogsChannelData = new bansLogsChannelModel({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                    await newBansLogsChannelData.save()
                } else {
                    await bansLogsChannelModel.findOneAndUpdate({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                }
        
                interaction.reply({ content: "The channel has been set to be the **Bans & Kicks Logs Channel**", ephemeral: true })

                break;
        }

    }
}