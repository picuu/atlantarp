const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "img",
    data: new SlashCommandBuilder()
        .setName("img")
        .setDescription("Envia una imágen a través del bot")
        .addStringOption(option => option.setName("img1").setDescription("El link de la imagen.").setRequired(true))
        .addStringOption(option => option.setName("img2").setDescription("El link de la imagen.").setRequired(false)),

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

        const img1 = interaction.options.getString("img1");
        const img2 = interaction.options.getString("img2");

        let imgFiles;

        if (!img2) imgFiles = [img1];
        if (img2) imgFiles = [img1, img2];

        interaction.reply({content: "Images sent!", ephemeral: true })
        interaction.channel.send({ files: imgFiles })

    }
}