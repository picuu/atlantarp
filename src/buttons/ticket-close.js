const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: {
        name: "ticket-close"
    },

    async run(client, interaction, webhookClient) {

        try {
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
            
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
    
            });
            
        } catch (e) {
            const button = client.buttons.get(interaction.customId);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando (button):** ${button.data.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el botón. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
            webhookClient.send({ embeds: [errEmbed] });
        }
    
    }
}