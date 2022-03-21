const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "whitelist",
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("El bot envia el mensaje de la Whitelist."),

    async run(client, interaction, webhookClient) {

        try {
            
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
    
            const embed = new Discord.MessageEmbed()
                .setTitle("Sistema de historias")
                .setDescription("Haga click en el botón inferior para mandar la historia de su personaje y poder unirse al servidor.\nEl canal que se cree solo será visible para usted y para los encargados de las historias.")
                .setColor(config.colorlessEmbed);
    
            const button = new Discord.MessageActionRow()
                .addComponents(
                        new Discord.MessageButton()
                            .setStyle("SUCCESS")
                            .setCustomId("whitelist-new")
                            .setLabel("Solicitar")
                            .setEmoji("🗳️")
                )
            
            interaction.channel.send({ embeds: [embed], components: [button] });
            interaction.reply({ content: "El mensaje de *Whitelist* se ha enviado!", ephemeral: true });

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