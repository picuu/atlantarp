const { SlashCommandBuilder } = require("@discordjs/builders")
const joinsLogsChannelModel = require("../../models/joinsLogs.js")
const ticketsLogsChannelModel = require("../../models/ticketsLogs.js")
const bansLogsChannelModel = require("../../models/bansLogs.js")
const whitelistModel = require("../../models/whitelistLogs.js")

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
            .addChoice("Whitelist", "whitelist")
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
        
                interaction.reply({ content: "El canal se usará para registrar la **entrada y salida de usuarios** en el servidor.", ephemeral: true })
                
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
        
                interaction.reply({ content: "El canal se usará para registrar los **tickets de ayuda**.", ephemeral: true })

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
        
                interaction.reply({ content: "El canal se usará para registar los **bans**, **kicks**, y **timeouts**.", ephemeral: true })

                break;

            case "whitelist":

                let whitelistData = await whitelistModel.findOne({ guildId: interaction.member.guild.id })
                if (!whitelistData) {
                    let newWhitelistDataa = new whitelistModel({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                    await newWhitelistDataa.save()
                } else {
                    await whitelistModel.findOneAndUpdate({
                        guildId: interaction.member.guild.id,
                        channelId: interaction.channel.id
                    })
                }
        
                interaction.reply({ content: "El canal se usará para registar la aceptación/denegación de nuevos usuarios.", ephemeral: true })

                break;
        }

    }
}