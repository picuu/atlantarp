const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("El bot contesta con su ping en milisegundos."),

    async run(client, interaction, webhookClient) {
        
        try {

            interaction.reply({ content: `🏓 Pong! **${client.ws.ping}ms**`});
            
        } catch (e) {
            const command = client.slashCommands.get(interaction.commandName);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando:** ${command.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
            webhookClient.send({ embeds: [errEmbed] });
        }

    }
}