const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: {
        name: "ticket-claim"
    },

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

        interaction.reply({ content: `<@${interaction.member.id}> ha reclamado el ticket.`, allowedMentions: { repliedUser: false } })
    
    }
}