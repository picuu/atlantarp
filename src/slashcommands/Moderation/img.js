const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    name: "img",
    data: new SlashCommandBuilder()
        .setName("img")
        .setDescription("Use a modal to send a message through the bot.")
        .addStringOption(option => option.setName("img1").setDescription("The link of an image").setRequired(true))
        .addStringOption(option => option.setName("img2").setDescription("The link of an image").setRequired(false)),

    async run(client, interaction) {

        const img1 = interaction.options.getString("img1");
        const img2 = interaction.options.getString("img2");

        let imgFiles;

        if (!img2) imgFiles = [img1];
        if (img2) imgFiles = [img1, img2];

        interaction.reply({content: "Images sent!", ephemeral: true })
        interaction.channel.send({ files: imgFiles })

    }
}