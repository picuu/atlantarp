const { SlashCommandBuilder } = require("@discordjs/builders")
const { Modal, TextInputComponent, showModal } = require("discord-modals")

module.exports = {
    name: "modal",
    data: new SlashCommandBuilder()
        .setName("modal")
        .setDescription("Use a modal to send a message through the bot."),

    async run(client, interaction) {

        const modal = new Modal()
            .setCustomId("tools-modal")
            .setTitle("Send an Embed")
            .addComponents(
                [
                    new TextInputComponent()
                        .setCustomId("text-title")
                        .setLabel("Title")
                        .setStyle("SHORT")
                        .setMaxLength(256)
                        .setPlaceholder("Write the title of the embed")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-description")
                        .setLabel("Description")
                        .setStyle("LONG")
                        .setMaxLength(3072)
                        .setPlaceholder("Writhe the description of the embed")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-warning")
                        .setLabel("Warning")
                        .setStyle("LONG")
                        .setMaxLength(256)
                        .setPlaceholder("Let it in blank for default warning")
                        .setDefaultValue("RECORDAR DESACTIVAR VUESTRO ANTIVIRUS")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-link")
                        .setLabel("Link")
                        .setStyle("SHORT")
                        .setMaxLength(2048)
                        .setPlaceholder("Writhe the description of the embed")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-imgs")
                        .setLabel("Images links")
                        .setStyle("SHORT")
                        .setMaxLength(768)
                        .setPlaceholder("Links of the images you want, separated by spaces")
                        .setRequired(false)
                ]
            )

        showModal(modal, { client: client, interaction: interaction });

    }
}