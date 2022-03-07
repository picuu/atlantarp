const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
const config = require("../../config.json")

module.exports = {
    name: "tickets",
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("The bot sends the tickets message."),

    async run(client, interaction) {

        await interaction.deferReply({ ephemeral: true })

        const tickets_embed = new Discord.MessageEmbed()
            .setTitle("Tickets")
            .setDescription("Please click the button below to create a new ticket. It will only be visible to you and staff, to assist you.\nPlease open a ticket **only when strictly necessary** or you may be penalized.")
            .setFooter({ text: `${interaction.guild.name}'s Staff`, iconURL: "https://media.discordapp.net/attachments/697541387901468724/939110857995071488/png.png" })
            .setColor(config.defaultSuccesColor)
            
        const button = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("new-ticket-button")
                        .setLabel("Create new ticket")
                        .setEmoji("🎫")
                ]
                // [
                //     new Discord.MessageButton()
                //         .setStyle("LINK")
                //         .setLabel("FAQ")
                //         .setEmoji("❓")
                //         .setURL("https://discord.com/channels/937059460415910018/940623479508729896") // FAQ Channel
                // ]
            )
        
        interaction.channel.send({ embeds: [tickets_embed], components: [button] })

        await interaction.editReply({ content: "The tickets message has been send!"})


    }

}