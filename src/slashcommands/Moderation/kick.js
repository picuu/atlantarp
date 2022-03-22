const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const config = require("../../config.json");
const bansLogsModel = require("../../models/bansLogs.js");

module.exports = {
    name: "kick",
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Expulsa a un miembro del servidor.")
        .addUserOption(option => option.setName("usuario").setDescription("El usuario a expulsar.").setRequired(true))
        .addStringOption(option => option.setName("razon").setDescription("La razón de la expulsión, si existe.").setRequired(false)),

    async run(client, interaction, webhookClient) {

        try {
            
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
            if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({ content: `No tienes los permisos suficientes para hacer eso!`, ephemeral: true });
    
            if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.reply({ content: `Me faltan permisos! Necesito el permiso de **expulsar miembros** para hacer eso.` });
    
            const user = interaction.options.getUser("usuario");
            const reason = interaction.options.getString("razon");
    
            const member = await interaction.guild.members.fetch(user.id)
    
            const embed = new Discord.MessageEmbed()
                .setColor(config.colorlessEmbed)
                .setTitle(`${member.user.tag} expulsado!`)
                .setDescription(`**ID del Usuario:** ${user.id}\n**Razón:** ${reason ? reason : "No se ha proporcionado ningúna razón."}`)
                .setFooter({ text: `Expulsado por ${interaction.member.user.tag}` })
                .setTimestamp()
    
            await member.kick({ reason: `${reason ? reason : "No se ha proporcionado ningúna razón."}` }).then(async () => {
                interaction.reply({ content: `**${member.user.tag}** ha sido expulsado del servidor.`, ephemeral: true })
    
                let logsChannel;
                let data = await bansLogsModel.findOne({ guildId: interaction.member.guild.id })
                if (data) {
                    logsChannel = await interaction.guild.channels.cache.get(data.channelId)
        
                    logsChannel.send({ embeds: [embed] })
                }
            });            

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