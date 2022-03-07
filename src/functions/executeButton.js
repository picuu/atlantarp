module.exports = async (client, interaction) => {

    // const commandName = interaction.message.interaction.commandName
    const buttonId = interaction.customId
    const button = client.buttons.get(buttonId)

    if (!button) return;

    try {
        await button.run(client, interaction)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true })
    }

}

