const Discord = require("discord.js");
const config = require("../config.json");
const ticketsLogsModel = require("../models/ticketsLogs.js");

module.exports = {
    data: {
        name: "ticket-delete"
    },

    async run(client, interaction, webhookClient) {
        
        try {
            
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
            
            let logsChannel;
            let data = await ticketsLogsModel.findOne({ guildId: interaction.member.guild.id })
            if (data) {
                logsChannel = await interaction.guild.channels.cache.get(data.channelId)
    
                logsChannel.send({ content: `Se ha cerrado un ticket, pero no se ha guardado: \`\`${interaction.channel.name}\`\`` })
            }
            
            if (interaction.channel.deletable) {
                
                interaction.reply({ content: "El ticket no se ha guardado. Eliminando canal..."})
        
                try {
                    setTimeout(() => {
                        interaction.channel.delete()
                    }, 5000)
                } catch (error) {
                    console.log(`[IGNORE_ERR] Se ha producido un error al intentar eliminar el canal *${interaction.channel.name}*.`)
                }
    
            }

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