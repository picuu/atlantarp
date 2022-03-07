const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
const config = require("../../config.json")
const bansLogsChannelModel = require("../../models/bansLogs.js")

module.exports = {
    name: "ban",
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban an user.")
        .addUserOption(option => option.setName("user").setDescription("The user you want to ban.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the ban, if any.").setRequired(false)),

    async run(client, interaction) {

        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: `You desn't have enough permissions!`, ephemeral: true });

        if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: `I don't have enough permissions! I need the *BAN_MEMBERS* permission to do that.`});

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const member = await interaction.guild.members.fetch(user.id)

        const embed = new Discord.MessageEmbed()
            .setColor(config.defaultErrorColor)
            .setTitle(`${member.user.tag} banned!`)
            .setDescription(`**User ID:** ${user.id}\n**Reason:** ${reason ? reason : "No reason provied"}`)
            .setFooter({ text: "Banned at"})
            .setTimestamp()

        await member.ban({ reason: `${reason ? reason : "No reason provied"}` }).then(async () => {
            interaction.reply({ content: `**${member.user.tag}** has been banned.`, ephemeral: true })

            let logsChannel;
            let data = await bansLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
            if (data) {
                logsChannel = await interaction.guild.channels.cache.get(data.channelId)
    
                logsChannel.send({ embeds: [embed] })
            }
        })

    }
}