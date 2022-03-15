const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const ms = require("ms");
const config = require("../../config.json");
const bansLogsModel = require("../../models/bansLogs.js");

module.exports = {
    name: "timeout",
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Aisla temporalmente (mutea) a un miembro del servidor por un tiempo determinado.")
        .addUserOption(option => option.setName("usuario").setDescription("El usuario a mutear.").setRequired(true))
        .addStringOption(option => option.setName("tiempo").setDescription("La duración de del timeout (ex: 15m / 2h / 1d).").setRequired(true))
        .addStringOption(option => option.setName("razon").setDescription("La razón del timeou, si existe.").setRequired(false)),

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
        if (!interaction.member.permissions.has("TIMEOUT_MEMBERS")) return interaction.reply({ content: `No tienes los permisos suficientes para hacer eso!`, ephemeral: true });

        if (!interaction.guild.me.permissions.has("TIMEOUT_MEMBERS")) return interaction.reply({ content: `Me faltan permisos! Necesito el permiso de **aislar temporalmente a miembros** para hacer eso.`});

        const user = interaction.options.getUser("usuario");
        const time = interaction.options.getString("tiempo")
        let reason = interaction.options.getString("razon");

        const member = await interaction.guild.members.fetch(user.id)
        const msTime = ms(time)

        if (!reason) reason = "No se ha proporcionado ningúna razón.";

        const embed = new Discord.MessageEmbed()
            .setColor(config.defaultErrorColor)
            .setTitle(`${member.user.tag} muteado!`)
            .setDescription(`**ID del Usuario:** ${user.id}\n**Duración:** ${time}\n**Razón:** ${reason}`)
            .setFooter({ text: `Muteado por ${interaction.member.user.tag}`})
            .setTimestamp()

        if (member.isCommunicationDisabled()) return interaction.reply({ content: "Este usuario ya está muteado!", ephemeral: true });

        await member.timeout(msTime, reason).then(async (err) => {
            if (err) return interaction.reply({ content: "No puede mutear a este usuario.", ephemeral: true });
            
            interaction.reply({ content: `**${member.user.tag}** ha sido muteado durante ${time}.`, ephemeral: true })

            let logsChannel;
            let data = await bansLogsModel.findOne({ guildId: interaction.member.guild.id })
            if (data) {
                logsChannel = await interaction.guild.channels.cache.get(data.channelId)
    
                logsChannel.send({ embeds: [embed] })
            }
        })

    }
}