module.exports = async (client, interaction, webhookClient) => {

    // const commandName = interaction.message.interaction.commandName
    const buttonId = interaction.customId
    const button = client.buttons.get(buttonId)

    if (!button) return;

    try {
        await button.run(client, interaction, webhookClient)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando.", ephemeral: true })
    }

}