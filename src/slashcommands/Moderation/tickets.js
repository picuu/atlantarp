const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "tickets",
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("El bot envia el mensaje de los tickets."),

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

        const tickets_embed = new Discord.MessageEmbed()
            .setTitle("Tickets")
            .setDescription("Haga click en el botón de abajo para crear un nuevo ticket de ayuda. Solo será visible para tú y el staff.\nAbra un ticket **solo cuando sea estrictamente necesario** o podrá ser penalizado.")
            .setColor(config.colorlessEmbed);

        const button = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("ticket-new")
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