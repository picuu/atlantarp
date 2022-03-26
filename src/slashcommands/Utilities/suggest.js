const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { colorlessEmbed } = require("../../config.json")
const suggestModel = require("../../models/suggestions.js");
const checkSuggestionsModel = require("../../models/checkSuggestionsCh.js");

module.exports = {
    name: "suggest",
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Haz una sugerencia para el servidor o el bot de Discord.")
        .addStringOption(option => option.setName("tipo").setDescription("Tipo de sugerencia.")
            .addChoice("Servidor RP", "Servidor RP")
            .addChoice("Servidor de Discord", "Servidor de Discord")
            .addChoice("Bot de Discord", "Bot de Discord")
            .addChoice("Otro", "Otro")
            .setRequired(true))
        .addStringOption(option => option.setName("sugerencia").setDescription("Describe tu sugerencia").setRequired(true)),

    async run(client, interaction, webhookClient) {
        
        try {

            const type = interaction.options.getString("tipo");
            const suggestion = interaction.options.getString("sugerencia");

            const embed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("Nueva sugerencia!")
            .addFields(
                { name: "Sugerencia:", value: suggestion, inline: false },
                { name: "Tipo:", value: type, inline: true },
                { name: "Estado", value: "Pendiente", inline: true },
                { name: "Por:", value: `<@${interaction.member.id}>`, inline: true }
            )
            .setTimestamp()

            const suggButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("suggest-accept")
                .setStyle("SUCCESS")
                .setLabel("Aceptar"),

                new MessageButton()
                .setCustomId("suggest-decline")
                .setStyle("DANGER")
                .setLabel("Denegar"),
            );

            const tracingEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Sugerencia enviada!")
            .setDescription("Tu sugerencia ha sido enviada para revisión, gracias por colaborar!\nQuieres **recibir noticias** sobre tu sugerencia?\nSi no contestas, obviaremos que **no** estas interesado.")
            .setFooter({ text: "Si acepta, se le enviará un mensaje privado cuando su sugerencia sea aceptada o rechazada." })

            const tracingButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("suggest-tracking-yes")
                .setStyle("PRIMARY")
                .setLabel("Acepto"),

                new MessageButton()
                .setCustomId("suggest-tracking-no")
                .setStyle("SECONDARY")
                .setLabel("No acepto")
            );

            let checkSuggData = await checkSuggestionsModel.findOne({ guildId: interaction.member.guild.id });
            if (!checkSuggData) return interaction.reply({ content: "Tu sugerencia no se ha procesado correctamente. Informa a un moderador sobre el error, gracias!", ephemeral: true });

            const checkSuggChannel = await interaction.guild.channels.cache.get(checkSuggData.channelId);

            const msg = await checkSuggChannel.send({ embeds: [embed], components: [suggButtons], fetchReply: true });
            interaction.reply({ embeds: [tracingEmbed], components: [tracingButtons], ephemeral: true });

            suggestModel.create({ guildId: interaction.guild.id, messageId: msg.id, details: [
                {
                    userId: interaction.member.id,
                    type: type,
                    suggestion: suggestion
                }
            ]});
            
        } catch (e) {
            const command = client.slashCommands.get(interaction.commandName);
            const errEmbed = new MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando:** ${command.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            console.log(e);
            webhookClient.send({ embeds: [errEmbed] });
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
        }

    }
}