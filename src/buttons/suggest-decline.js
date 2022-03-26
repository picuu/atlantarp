const Discord = require("discord.js");
const config = require("../config.json");
const suggestionModel = require("../models/suggestions.js");

module.exports = {
    data: {
        name: "suggest-decline"
    },

    async run(client, interaction, webhookClient) {

        try {
            
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
    
            suggestionModel.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id}, async(err, data) => {
                if (err) throw err;
                if (!data) return interaction.reply({ content: "No se ha encontrado información en la base de datos", ephemeral: true });

                const embed = interaction.message.embeds[0];
                if (!embed) return;

                embed.fields[2] = {name: "Estado", value: "Rechazada", inline: true}
                interaction.message.edit({ embeds: [embed.setColor("RED")], components: [] });
                return interaction.reply({ content: "Sugerencia rechazada!", ephemeral: true });
            });

        } catch (e) {
            const button = client.buttons.get(interaction.customId);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando (button):** ${button.data.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            console.log(e);
            webhookClient.send({ embeds: [errEmbed] });
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el botón. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
        }
    
    }
}