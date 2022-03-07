module.exports = async (client, interaction) => {

    // const commandName = interaction.message.interaction.commandName
    const selectMenuId = interaction.customId
    const selectMenu = client.selectMenus.get(selectMenuId)

    if (!selectMenu) return;

    try {
        await selectMenu.run(client, interaction)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true })
    }

}