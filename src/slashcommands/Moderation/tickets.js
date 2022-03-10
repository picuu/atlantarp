const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
const config = require("../../config.json")

module.exports = {
    name: "tickets",
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("El bot envia el mensaje de los tickets."),

    async run(client, interaction) {

        const tickets_embed = new Discord.MessageEmbed()
            .setTitle("Tickets")
            .setDescription("Haga click en el botón de abajo para crear un nuevo ticket de ayuda. Solo será visible para tú y el staff.\nAbra un ticket **solo cuando sea estrictamente necesario** o podrá ser penalizado.")
            .setColor(config.colorlessEmbed);

        const button = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("new-ticket")
                        .setLabel("Crear nuevo ticket")
                        .setEmoji("🎫")
                ],
                [
                    new Discord.MessageButton()
                        .setStyle("LINK")
                        .setLabel("FAQ")
                        .setEmoji("❓")
                        .setURL("https://discord.com/channels/934149605912895538/934149606361673748") // FAQ Channel
                ]
            )
        
        interaction.channel.send({ embeds: [tickets_embed], components: [button] })
        interaction.reply({ content: "El mensaje de *Tickets* se ha enviado!", ephemeral: true })

    }

}