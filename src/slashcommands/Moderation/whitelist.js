const { SlashCommandBuilder } = require("@discordjs/builders")
const Discord = require("discord.js")
const config = require("../../config.json")

module.exports = {
    name: "allowlist",
    data: new SlashCommandBuilder()
        .setName("allowlist")
        .setDescription("El bot envia el mensaje de la AllowList."),

    async run(client, interaction) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Sistema de historias")
            .setDescription("Haga click en el botón inferior para mandar la historia de su personaje y poder unirse al servidor.\nEl canal que se cree solo será visible para usted y para los encargados de las historias.")
            .setColor(config.colorlessEmbed);

        const button = new Discord.MessageActionRow()
            .addComponents(
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("whitelist-new")
                        .setLabel("Solicitar")
                        .setEmoji("🗳️")
            )
        
        interaction.channel.send({ embeds: [embed], components: [button] })
        interaction.reply({ content: "El mensaje de *Whitelist* se ha enviado!", ephemeral: true })

    }

}