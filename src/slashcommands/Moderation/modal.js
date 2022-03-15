const { SlashCommandBuilder } = require("@discordjs/builders");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    name: "modal",
    data: new SlashCommandBuilder()
        .setName("modal")
        .setDescription('Usa un "modal" para enviar un mensaje a través del bot.'),

    async run(client, interaction) {

        // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
        const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
        if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

        const modal = new Modal()
            .setCustomId("general-modal")
            .setTitle("Envia un mensaje a través del bot.")
            .addComponents(
                [
                    new TextInputComponent()
                        .setCustomId("text")
                        .setLabel("Texto")
                        .setStyle("LONG")
                        .setMaxLength(3072)
                        .setPlaceholder("Puedes usar markdown")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-imgs")
                        .setLabel("Imágenes (links)")
                        .setStyle("SHORT")
                        .setMaxLength(928)
                        .setPlaceholder("Links de las imágenes, separados por espacios")
                        .setRequired(false)
                ]
            )

        showModal(modal, { client: client, interaction: interaction });

    }
}