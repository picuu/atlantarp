const Discord = require("discord.js");
const config = require("../config.json");
const suggestTrackingModel = require("../models/suggestTracking.js");

module.exports = {
    data: {
        name: "suggest-tracking-no"
    },

    async run(client, interaction, webhookClient) {

        try {
            
            const data = await suggestTrackingModel.findOne({ userId: interaction.member.id });
            if (!data) {
                const newData = new suggestTrackingModel({
                    userId: interaction.member.id,
                    tracking: false
                });
                await newData.save();
            } else {
                await suggestTrackingModel.findOneAndUpdate({ userId: interaction.member.id, tracking: false });
            }

            interaction.reply({ content: "Entenido! **No** recibirás ninguna notícia sobre tu sugerencia.", ephemeral: true });

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