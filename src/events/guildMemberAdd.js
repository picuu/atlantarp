const Discord = require("discord.js");
const joinsLogsChannelModel = require("../models/joinsLogs.js")

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        const memberRole = member.guild.roles.cache.find(role => role.name === "Member") || member.guild.roles.cache.find(role => role.id === "937060418432675881")
        member.roles.add(memberRole.id)

        let joinsLogsChannel;
        let data = await joinsLogsChannelModel.findOne({ guildId: member.guild.id })
        if (!data) {
                return;
        } else {
            joinsLogsChannel = data.channelId
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`${member.user.tag} | ${member.user.id}`)
            .setDescription(`Joined the server.`)
            .setTimestamp()
            .setColor("GREEN")

        member.guild.channels.cache.get(joinsLogsChannel).send({ embeds: [embed] })

    }
}