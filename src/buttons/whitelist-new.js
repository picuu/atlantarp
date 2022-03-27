const Discord = require("discord.js");
const config = require("../config.json");
const whitelistModel = require("../models/whitelistLogs.js");
const whitelistApprovedModel = require("../models/whitelistApproved.js");
const { createTranscript } = require("discord-html-transcripts");
const ms = require("ms");
const { inlineCode } = require("@discordjs/builders");

module.exports = {
    data: {
        name: "whitelist-new"
    },

    async run(client, interaction, webhookClient) {
       
        try {
            
            let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "");
            let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.topic === `solicitud-${interaction.member.id}`));
            if (AlreadyCreatedTicket) return interaction.reply({ content: `Ya tienes una solicitud abierta en ${AlreadyCreatedTicket}, no puedes abrir otra!`, ephemeral: true });
    
            const usuario_roleId = "934149605938065455";
            const everyone_role = interaction.guild.roles.cache.find(role => role.name === "@everyone");
    
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const mods_rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            const examinador_roleId = "934149605963210829";
    
            let categoryParent;
    
            if(!interaction.guild.channels.cache.find(channel => channel.name === "WHITELIST")) { 
                categoryParent = await interaction.guild.channels.create(`WHITELIST`, {
                    type: "GUILD_CATEGORY",
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                        {
                            id: examinador_roleId,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                        {
                            id: usuario_roleId,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },
                        {
                            id: everyone_role.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        }
                    ]
                });
    
                mods_rolesIds.forEach(async (roleId) => {
                    const role = await interaction.guild.roles.fetch(roleId);
    
                    categoryParent.permissionOverwrites.edit(role, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    });
                });
            } else {
                categoryParent = interaction.guild.channels.cache.find(channel => channel.name === "WHITELIST");
            }
    
            interaction.guild.channels.create(`solicitud-${username}`, {
                type: "GUILD_TEXT",
                parent: categoryParent.id,
                topic: `solicitud-${interaction.member.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: examinador_roleId,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: usuario_roleId,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    },
                    {
                        id: everyone_role.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                    }
                ]
            }).then(async (petitionChannel) => {
    
                mods_rolesIds.forEach(async (roleId) => {
                    const role = await interaction.guild.roles.fetch(roleId);
    
                    petitionChannel.permissionOverwrites.edit(role, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    });
                });
    
                interaction.reply({ content: `Tu solicitud se ha creado correctamente! Ve a <#${petitionChannel.id}>`, ephemeral: true })
    
                const petitionOpened_embed = new Discord.MessageEmbed()
                .setTitle("Solicitud creada! 📥")
                .setDescription(
                    `Para enviar tu historia, envía un **PDF** rellenando el siguiente formulario:\n` +
                    `\`\`\`md\n` +
                    `----- Información OOC -----\n- Nombre y edad OCC: \n- URL de Steam: \n` +
                    `----- Historia PJ -----\n- Nombre: \n- Apellido: \n- Fecha de nacimiento: \n- Procedencia: \n- Profesión/formación: \n- Historial médico: \n` +
                    `- Clase social: \n- Apariencia física: \n- Personalidad: \n- Intereses: \n- Aversiones: \n- Fortalezas: \n- Debilidades: \n- Objetivos: \n- Historia: \n` +
                    `\`\`\`\n` +
                    `**La historia debe estar bien detallada, sin un gran salto temporal, para de esta forma conocer bien el pasado del personaje y poder predecir como sería su futuro en el servidor.**\n`
                )
                .setColor(config.colorlessEmbed)
                .setFooter({ text: `Un moderador vendrá a revisar tu petición en breves, por favor, se paciente.`})
    
                const petitionButtons = new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageButton()
                                .setStyle("SUCCESS")
                                .setCustomId("whitelist-accept")
                                .setLabel("Aceptar petición")
                                .setEmoji("✅")
                        ],
                        [
                            new Discord.MessageButton()
                                .setStyle("DANGER")
                                .setCustomId("whitelist-deny")
                                .setLabel("Denegar petición")
                                .setEmoji("❎")
                        ],
                        [
                            new Discord.MessageButton()
                                .setStyle("SECONDARY")
                                .setCustomId("whitelist-dismiss")
                                .setLabel("Descartar solicitud")
                                .setEmoji("🗑️")
                        ]
                    );
    
                const examinadorRoleId = "934149605963210829";
                await petitionChannel.send({ content: `<@&${examinadorRoleId}>`, embeds: [petitionOpened_embed], components: [petitionButtons] }).then((channel) => {
    
                    // const ifilter = i => i.user.id === interaction.member.id
                    const collector = channel.createMessageComponentCollector({ componentType: "BUTTON" })
    
                    collector.on("collect", async i => {
    
                        if (!mods_rolesIds.some(r => i.member.roles.cache.has(r))) return i.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });
    
                        if (i.customId === "whitelist-accept") {
                            
                            i.channel.permissionOverwrites.edit(interaction.member, {
                                SEND_MESSAGES: false,
                            });
    
                            const usuarioRoleId = "934149605938065455";
                            // const testRoleId = "930550538481844314";
                            interaction.member.roles.add(usuarioRoleId);
    
                            const registerPetitionEmbed = new Discord.MessageEmbed()
                                .setColor("GREEN")    
                                .setTitle("Nuevo usuario aceptado")
                                .setDescription(`**Usuario:** ${interaction.member.user.tag}\n**ID:** ${interaction.member.id}\n**Aceptado por:** ${i.member.user.tag}`)
                                .setTimestamp()
    
                            const attachment = await createTranscript(petitionChannel, {
                                limit: -1,
                                returnBuffer: false,
                                fileName: `whitelist-accept-${petitionChannel.name}.html`
                            })
                            
                            let logsChannel;
                            let logsData = await whitelistModel.findOne({ guildId: interaction.member.guild.id })
                            if (logsData) {
                                logsChannel = await interaction.guild.channels.cache.get(logsData.channelId)
                    
                                logsChannel.send({ embeds: [registerPetitionEmbed], files: [attachment] })
                            } else {
                                return i.reply({ content: `No hay un canal establecido para los logs de la Whitelist. Establece uno con el comando \`\`/set_logs\`\`.`, ephemeral: true })
                            }
    
                            i.reply({ content: "La petición ha sido aceptada correctamente! El canal se eliminará en 10 segundos...", ephemeral: true })
    
                            let approvedLogsChannel;
                            let approvedData = await whitelistApprovedModel.findOne({ guildId: interaction.member.guild.id })
                            if (approvedData) {
                                approvedLogsChannel = await interaction.guild.channels.cache.get(approvedData.channelId)
                    
                                approvedLogsChannel.send({ content: `Felicidades <@${interaction.member.id}>, has aprobado la whitelist. A rolear!` })
                            }
    
                            channel.edit({ embeds: [petitionOpened_embed], components: [] }).then(() => {
                                collector.stop()
                                setTimeout(() => {
                                    if (petitionChannel.deletable) {
                                        petitionChannel.delete()
                                    }
                                }, ms("10s"));
                            });
    
                        } else if (i.customId === "whitelist-deny") {
    
                            const registerPetitionEmbed = new Discord.MessageEmbed()
                            .setColor("RED")    
                            .setTitle("Nuevo usuario denegado")
                            .setDescription(`**Usuario:** ${interaction.member.user.tag}\n**ID:** ${interaction.member.id}\n**Denegado por:** ${i.member.user.tag}`)
                            .setTimestamp()
    
                            const attachment = await createTranscript(petitionChannel, {
                                limit: -1,
                                returnBuffer: false,
                                fileName: `whitelist-deny-${petitionChannel.name}.html`
                            })
                            
                            let logsChannel;
                            let data = await whitelistModel.findOne({ guildId: interaction.member.guild.id })
                            if (data) {
                                logsChannel = await interaction.guild.channels.cache.get(data.channelId)
                    
                                logsChannel.send({ embeds: [registerPetitionEmbed], files: [attachment] })
                            } else {
                                return i.reply({ content: `No hay un canal establecido para los logs de la Whitelist. Establece uno con el comando \`\`/set_logs\`\`.`, ephemeral: true })
                            }
    
                            i.reply({ content: "La petición ha sido denegada.", ephemeral: true })
                            i.channel.send({ content: `<@${interaction.member.user.id}>, tu solicitud ha sido rechazada. Corrige los siguientes errores, por favor:` })
    
                        } else if (i.customId === "whitelist-dismiss") {
                            
                            if (i.channel.deletable) {
                                interaction.reply("Borrando solicitud...");
                                collector.stop();
                                setTimeout(() => {
                                    i.channel.delete();
                                }, ms("5s"))
                            }

                        }
        
                    });
    
                });
    
            });

        } catch (e) {
            const button = client.buttons.get(interaction.customId);
            const errEmbed = new Discord.MessageEmbed()
                .setTitle("Nuevo ERROR encontrado!")
                .setDescription(`**Canal del error:** ${interaction.channel.name}\n**ID del canal:** ${interaction.channel.id}\n**Comando (button):** ${button.data.name}\n**Usuario:** ${interaction.member.user.tag}\n**ID del usuario:** ${interaction.member.id}\n\n**Error:**\n\`\`\`sh\n${e}\`\`\``)
                .setColor("RED")
    
            interaction.reply({ content: "Ha ocurrido un error al ejecutar el botón. Los encargados han sido avisados, gracias por tu comprensión y disculpa las molestias!", ephemeral: true });
            webhookClient.send({ embeds: [errEmbed] });
        }

    }

}