const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "tickets",
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("Comandos del sistema de tickets.")
        .addSubcommand(subcommand => subcommand.setName("mensaje").setDescription("El bot envia el mensaje de los tickets."))
        .addSubcommand(subcommand => subcommand.setName("añadir_usuario").setDescription("Añadir a un usuario al ticket.")
            .addUserOption(option => option.setName("usuario").setDescription("El usuario a añadir.").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("eliminar_usuario").setDescription("Eliminar un usuario del ticket")
            .addUserOption(option => option.setName("usuario").setDescription("El usuario a eliminar.").setRequired(true))),

    async run(client, interaction, webhookClient) {

        try {

            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            if (!rolesIds.some(r => interaction.member.roles.cache.has(r))) return interaction.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
    
            const command = interaction.options.getSubcommand();
    
            if (command === "mensaje") {
                
                const tickets_embed = new Discord.MessageEmbed()
                    .setTitle("Tickets")
                    .setDescription("Haga click en el botón de abajo para crear un nuevo ticket de ayuda. Solo será visible para tú y el staff.\nAbra un ticket **solo cuando sea estrictamente necesario** o podrá ser penalizado.")
                    .setColor(config.colorlessEmbed);
        
                const button = new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageButton()
                                .setStyle("SUCCESS")
                                .setCustomId("ticket-new")
                                .setLabel("Crear nuevo ticket")
                                .setEmoji("🎫")
                        ]
                        // [
                        //     new Discord.MessageButton()
                        //         .setStyle("LINK")
                        //         .setLabel("FAQ")
                        //         .setEmoji("❓")
                        //         .setURL("https://discord.com/channels/934149605912895538/934149606361673748") // FAQ Channel
                        // ]
                    )
                
                interaction.channel.send({ embeds: [tickets_embed], components: [button] })
                interaction.reply({ content: "El mensaje de *Tickets* se ha enviado!", ephemeral: true })
    
            } else if (command === "añadir_usuario") {
    
                const user = interaction.options.getUser("usuario");
                const member = await interaction.guild.members.fetch(user.id);
        
                if (member.permissionsIn(interaction.channel).has("VIEW_CHANNEL")) return interaction.reply({ content: `Este usuario ya está en el ticket`, ephemeral: true });
    
                interaction.channel.permissionOverwrites.edit(member, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true
                });
        
                interaction.reply({ content: `<@${member.id}> ha sido añadido al ticket!`, allowedMentions: { parse: [] } });
    
            } else if (command === "eliminar_usuario") {
    
                const user = interaction.options.getUser("usuario");
                const member = await interaction.guild.members.fetch(user.id);
        
                // rolesIds: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
                if (rolesIds.some(r => member.roles.cache.has(r))) return interaction.reply({ content: `No puedes eliminar a un moderador del ticket!`, ephemeral: true });
    
                if (!member.permissionsIn(interaction.channel).has("VIEW_CHANNEL")) return interaction.reply({ content: `Este usuario no está en el ticket`, ephemeral: true });
    
                interaction.channel.permissionOverwrites.delete(member);
        
                interaction.reply({ content: `<@${member.id}> ha sido eliminado del ticket!`, allowedMentions: { parse: [] } });
    
            } else {
                interaction.reply({ content: "El comando no se ejecutó correctamente", ephemeral: true });
            }
            
        } catch (e) {
            const command = client.slashCommands.get(interaction.commandName);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando:** ${command.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el comando. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
            webhookClient.send({ embeds: [errEmbed] });
        }

    }

}