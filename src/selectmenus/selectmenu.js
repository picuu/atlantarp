const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "selectmenu"
    },

    async run(client, interaction, webhookClient) {

        try {
            
            // This file is only for not crashing purposes :D
            console.log("./selectmenus/selectmenu.js");

        } catch (e) {
            const selectMenu = client.selectMenus.get(interaction.customId);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando (selectMenu):** ${selectMenu.data.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el menú. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
            webhookClient.send({ embeds: [errEmbed] });
        }

    }

}