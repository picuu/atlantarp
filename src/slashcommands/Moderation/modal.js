const { SlashCommandBuilder } = require("@discordjs/builders")
const { Modal, TextInputComponent, showModal } = require("discord-modals")

module.exports = {
    name: "modal",
    data: new SlashCommandBuilder()
        .setName("modal")
        .setDescription("Use a modal to send a message through the bot."),

    async run(client, interaction) {

        const modal = new Modal()
            .setCustomId("general-modal")
            .setTitle("Send a message through the bot.")
            .addComponents(
                [
                    new TextInputComponent()
                        .setCustomId("text")
                        .setLabel("Text")
                        .setStyle("LONG")
                        .setMaxLength(3072)
                        .setPlaceholder("Text input")
                        .setRequired(false)
                ],
                [
                    new TextInputComponent()
                        .setCustomId("text-imgs")
                        .setLabel("Images links")
                        .setStyle("SHORT")
                        .setMaxLength(928)
                        .setPlaceholder("Links of the images you want, separated by spaces")
                        .setRequired(false)
                ]
            )

        showModal(modal, { client: client, interaction: interaction });

    }
}