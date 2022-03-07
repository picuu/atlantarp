const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "ticket-close"
    },

    async run(client, interaction) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: "Only admins and staff can close tickets!", ephemeral: true });
        
        const confirm_buttons = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                        .setStyle("SUCCESS")
                        .setCustomId("ticket-save")
                        .setLabel("Yes, save and delete it")
                        .setEmoji("💾")
                ],
                [
                    new Discord.MessageButton()
                        .setStyle("DANGER")
                        .setCustomId("ticket-delete")
                        .setLabel("Just delete it")
                        .setEmoji("🗑️")
                ],
                [
                    new Discord.MessageButton()
                        .setStyle("SECONDARY")
                        .setCustomId("ticket-cancel-close")
                        .setLabel("Cancel")
                ]
            )

        interaction.reply({ content: "Do you really want to close the ticket?", ephemeral: true })
        interaction.channel.send({ content: "Do you want to save the ticket?", components: [confirm_buttons] }).then(async (msg) => {

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