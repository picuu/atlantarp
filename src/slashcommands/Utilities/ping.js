const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("El bot contesta con su ping en milisegundos."),

    async run(client, interaction) {
        
        interaction.reply({ content: `🏓 Pong! **${client.ws.ping}ms**`});

    }
}