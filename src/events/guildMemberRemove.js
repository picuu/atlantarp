const Discord = require("discord.js");
const joinsModel = require("../models/joinsLogs.js");

module.exports = {
    name: "guildMemberRemove",

    async execute(client, member) {

        const embed = new Discord.MessageEmbed()
            .setTitle(`${member.user.tag} | ${member.user.id}`)
            .setDescription(`Se ha ido del servidor.\nSe unió <t:${Math.floor(member.joinedTimestamp / 1000)}:f>`)
            .setThumbnail(member.displayAvatarURL())
            .setTimestamp()
            .setColor("RED")
        
        let joinsChannel;
        let data = await joinsModel.findOne({ guildId: member.guild.id })
        if (data) {
            joinsChannel = data.channelId;
            
            member.guild.channels.cache.get(joinsLogsChannel).send({ embeds: [embed] })
        }

    }
}