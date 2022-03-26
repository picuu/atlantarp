const Discord = require("discord.js");
const config = require("../config.json");
const suggestionModel = require("../models/suggestions.js");
const publicSuggestModel = require("../models/publicSuggestionsCh.js");
const suggestTrackingModel = require("../models/suggestTracking.js");

module.exports = {
    data: {
        name: "suggest-accept"
    },

    async run(client, interaction, webhookClient) {

        try {
            
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
    
            let publicSuggestCh;
            let SuggestChData = await publicSuggestModel.findOne({ guildId: interaction.member.guild.id });
            if (SuggestChData) {
                publicSuggestCh = await interaction.guild.channels.cache.get(SuggestChData.channelId);
            } else {
                 return interaction.reply({ content: `No hay un canal establecido para enviar las sugerencias aceptadas. Establece uno con el comando \`\`/set_logs\`\`.`, ephemeral: true });
            }

            let tracking;
            let trackingData = await suggestTrackingModel.findOne({ userId: interaction.member.id });
            if (trackingData) {
                tracking = trackingData.tracking;
            }

            suggestionModel.findOne({ guildId: interaction.guild.id, messageId: interaction.message.id}, async(err, data) => {
                if (err) throw err;
                if (!data) return interaction.reply({ content: "No se ha encontrado información en la base de datos", ephemeral: true });

                const Embed = interaction.message.embeds[0];
                if (!Embed) return;

                Embed.fields[2] = {name: "Estado", value: "Aceptada", inline: true}
                interaction.message.edit({ embeds: [Embed.setColor("GREEN")], components: [] });
                interaction.reply({ content: "Sugerencia aceptada correctamente!", ephemeral: true });

                const suggestion = Embed.fields[0].value;
                const type = Embed.fields[1].value;
                const userId = data.details[0].userId;

                const acceptedEmbed = new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setTitle("Nueva sugerencia! 📰")
                .addFields(
                    { name: "Tipo:", value: type, inline: true },
                    { name: "Por:", value: `<@${userId}>`, inline: true },
                    { name: "Sugerencia:", value: suggestion, inline: false }
                )
                .setTimestamp()

                publicSuggestCh.send({ embeds: [acceptedEmbed] }).then((msg) => {
                    msg.react("👍🏼");
                    msg.react("👎🏼");
                });

                const trackingEmbed = new Discord.MessageEmbed()
                .setColor("DARK_VIVID_PINK")
                .setTitle("Tu sugerencia ha sido aceptada!")
                .setDescription(`Puedes ver la sugerencia que hiciste en **${interaction.guild.name}** en ${publicSuggestCh}.`)
                .addField("Sugerencia", suggestion)
                .setTimestamp()

                if (tracking) interaction.guild.members.cache.get(trackingData.userId).send({ embeds: [trackingEmbed] });
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