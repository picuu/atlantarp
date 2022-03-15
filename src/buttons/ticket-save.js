const Discord = require("discord.js");
const config = require("../config.json");
const ticketsLogsModel = require("../models/ticketsLogs.js");
const { createTranscript } = require("discord-html-transcripts");
const moment = require("moment");


module.exports = {
    data: {
        name: "ticket-save"
    },

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
        
        let date = moment().format("YYMMDD");

        const attachment = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${date}-${interaction.channel.name}.html`
        })

        let logsChannel;
        let data = await ticketsLogsModel.findOne({ guildId: interaction.member.guild.id })
        if (data) {
            logsChannel = await interaction.guild.channels.cache.get(data.channelId)

            logsChannel.send({ content: `**NUEVO TICKET GUARDADO**\n${date}-${interaction.channel.name}`, files: [attachment] })
        } else {
             return interaction.reply({ content: `No hay un canal establecido para los logs de los Tickets. Establece uno con el comando \`\`/set_logs\`\`.`, ephemeral: true })
        }

        if (interaction.channel.deletable) {

            interaction.reply({ content: "El ticket se ha guardado con éxito! Eliminando canal..."})

            setTimeout(() => {
                interaction.channel.delete()
            }, 5000)
        }
    
    }
}