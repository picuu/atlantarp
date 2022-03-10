const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "ticket-close"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Solo los administradores y staff pueden cerrar tickets!", ephemeral: true });
        
        const confirm_buttons = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("ticket-save")
                        .setLabel("Guárdalo")
                        .setEmoji("💾")
                ],
                [
                    new Discord.MessageButton()
                        .setStyle("DANGER")
                        .setCustomId("ticket-delete")
                        .setLabel("No lo guardes")
                        .setEmoji("🗑️")
                ],
                [
                    new Discord.MessageButton()
                        .setStyle("SECONDARY")
                        .setCustomId("ticket-cancel-close")
                        .setLabel("Cancelar")
                ]
            )

        // interaction.reply({ content: "Do you really want to close the ticket?", ephemeral: true })
        interaction.reply({ content: "Quieres guardar el ticket?", components: [confirm_buttons] })
        await interaction.fetchReply().then(async (msg) => {

            const ifilter = i => i.user.id === interaction.member.id
            const collector = msg.createMessageComponentCollector({ filter: ifilter, componentType: "BUTTON", time: 60000 })
    
            collector.on("collect", async i => {

                if (i.customId === "ticket-cancel-close") {
                    msg.delete()
                }

            })

            collector.on("end", collected => {
                if (collected < 1) {
                    msg.delete()
                }
            })

        })
    
    }
}