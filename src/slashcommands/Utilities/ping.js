const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("The bot replies with your ping in ms."),

    async run(client, interaction) {
        
        interaction.reply({ content: `Pong! **${client.ws.ping}ms**`})

    }
}