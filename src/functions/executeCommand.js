module.exports = async (client, interaction) => {

    const command = client.slashCommands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.run(client, interaction)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando.", ephemeral: true })
    }

}