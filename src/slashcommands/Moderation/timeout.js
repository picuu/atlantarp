const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
const ms = require("ms")
const config = require("../../config.json")
const bansLogsChannelModel = require("../../models/bansLogs.js")

module.exports = {
    name: "timeout",
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout (mute) a user for a specific time.")
        .addUserOption(option => option.setName("user").setDescription("The user you want to timeout.").setRequired(true))
        .addStringOption(option => option.setName("time").setDescription("The duration of the timeout (ex: 15m / 2h / 1d).").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the timeout, if any.").setRequired(false)),

    async run(client, interaction) {

        if (!interaction.member.permissions.has("TIMEOUT_MEMBERS")) return interaction.reply({ content: `You desn't have enough permissions!`, ephemeral: true });

        if (!interaction.guild.me.permissions.has("TIMEOUT_MEMBERS")) return interaction.reply({ content: `I don't have enough permissions! I need the *TIMEOUT_MEMBERS* permission to do that.`});

        const user = interaction.options.getUser("user");
        const time = interaction.options.getString("time")
        let reason = interaction.options.getString("reason");

        const member = await interaction.guild.members.fetch(user.id)
        const msTime = ms(time)

        if (!reason) reason = "No reason provied";

        const embed = new Discord.MessageEmbed()
            .setColor(config.defaultErrorColor)
            .setTitle(`${member.user.tag} timed-out!`)
            .setDescription(`**User ID:** ${user.id}\n**Duration:** ${time}\n**Reason:** ${reason}`)
            .setFooter({ text: `Timed-out by ${interaction.member.user.tag}`})
            .setTimestamp()

        if (member.isCommunicationDisabled()) return interaction.reply({ content: "This user is already timed out!", ephemeral: true });

        await member.timeout(msTime, reason).then(async (err) => {
            if (err) return interaction.reply({ content: "I can't timeout this user.", ephemeral: true });
            
            interaction.reply({ content: `**${member.user.tag}** has been timed-out for ${time}.`, ephemeral: true })

            let logsChannel;
            let data = await bansLogsChannelModel.findOne({ guildId: interaction.member.guild.id })
            if (data) {
                logsChannel = await interaction.guild.channels.cache.get(data.channelId)
    
                logsChannel.send({ embeds: [embed] })
            }
        })

    }
}