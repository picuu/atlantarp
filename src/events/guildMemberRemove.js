const Discord = require("discord.js");
const joinsLogsChannelModel = require("../models/joinsLogs.js")

module.exports = {
    name: "guildMemberRemove",

    async execute(client, member) {

        let joinsLogsChannel;
        let data = await joinsLogsChannelModel.findOne({ guildId: member.guild.id })
        if (!data) {
                return;
        } else {
            joinsLogsChannel = data.channelId
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`${member.user.tag} | ${member.user.id}`)
            .setDescription(`Left the server.\nJoined at: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`)
            .setTimestamp()
            .setColor("RED")

        member.guild.channels.cache.get(joinsLogsChannel).send({ embeds: [embed] })


    }
}