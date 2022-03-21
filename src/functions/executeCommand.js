const Discord = require("discord.js");

module.exports = async (client, interaction, webhookClient) => {

    const command = client.slashCommands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.run(client, interaction, webhookClient)
    } catch (err) {
        console.error(err)
        return interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando.", ephemeral: true })
    }

}