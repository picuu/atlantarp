const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: {
        name: "ticket-new"
    },
    
    async run(client, interaction, webhookClient) {
        
        try {
            
            let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "");
            let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.topic === `ticket-${interaction.member.id}`));
            if (AlreadyCreatedTicket) return interaction.reply({ content: `Ya tienes un ticket abierto en ${AlreadyCreatedTicket}, no puedes crear otro!`, ephemeral: true });
            
            const usuario_roleId = "934149605938065455";
            const everyone_role = interaction.guild.roles.cache.find(role => role.name === "@everyone");
            
            // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
            const mods_rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
            
            let categoryParent;
            
            if(!interaction.guild.channels.cache.find(channel => channel.name === "TICKETS")) { 
                categoryParent = await interaction.guild.channels.create(`TICKETS`, {
                    type: "GUILD_CATEGORY",
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
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
                categoryParent = interaction.guild.channels.cache.find(channel => channel.name === "TICKETS");
            }
            
            
            interaction.guild.channels.create(`ticket-${username}`, {
                type: "GUILD_TEXT",
                parent: categoryParent.id,
                topic: `ticket-${interaction.member.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
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
            }).then(async (ticketChannel) => {
            
                mods_rolesIds.forEach(async (roleId) => {
                    const role = await interaction.guild.roles.fetch(roleId);
            
                    ticketChannel.permissionOverwrites.edit(role, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true
                    });
                });
            
                interaction.reply({ content: `Tu ticket se ha creado satisfactoriamente! Ve a <#${ticketChannel.id}>`, ephemeral: true });
            
                const ticketCreated_embed = new Discord.MessageEmbed()
                .setTitle("Ticket creado!")
                .setDescription(`La ayuda llegará enseguida.\nEmpieza por decirnos el motivo del ticket con ayuda del menú inferior.\n\nSi **no eliges ninguna categoría**, el ticket se **cerrará** automaticamente en **2 minutos**.`)
                .setColor(config.colorlessEmbed)
            
                const ticketCategoryMenu = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId("ticket-categories")
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    label: "Soporte",
                                    description: "Pide ayuda sobre un tema relacionado con soporte",
                                    value: "soporte",
                                    emoji: "🔧"
                                },
                                {
                                    label: "CK/PKT",
                                    description: "Pide ayuda sobre un tema relacionado con CK/PKT",
                                    value: "ck-pkt",
                                    emoji: "💀"
                                },
                                {
                                    label: "Donaciones",
                                    description: "Pide ayuda sobre las donaciones",
                                    value: "donaciones",
                                    emoji: "💸"
                                },
                                {
                                    label: "Reportes",
                                    description: "Pide ayuda sobre los reportes, o reporta a un usuario",
                                    value: "reportes",
                                    emoji: "⛔"
                                },
                                {
                                    label: "Sistema ilícito",
                                    description: "Presenta tu sistema ilícito",
                                    value: "sist-ilicito",
                                    emoji: "🔪"
                                },
                                {
                                    label: "Comercio",
                                    description: "Pide ayuda sobre un tema relacionado con comercio",
                                    value: "comercio",
                                    emoji: "🧑‍💼"
                                },
                                {
                                    label: "Otros",
                                    description: "Pide ayuda sobre otro tema",
                                    value: "otros",
                                    emoji: "📋"
                                }
                            ])
                    );
            
                await ticketChannel.send({ embeds: [ticketCreated_embed], components: [ticketCategoryMenu] }).then((msg) => {
            
                    const ifilter = i => i.user.id === interaction.member.id
                    const collector = msg.createMessageComponentCollector({ filter: ifilter, componentType: "SELECT_MENU", time: 120000 })
            
                    collector.on("collect", async i => {
            
                        const ticketCategory = i.values[0];
                        let category;
            
                        switch (ticketCategory) {
                            case "soporte":
                                category = "Soporte"
                                break
                            case "ck-pkt":
                                category = "CK/PKT"
                                break
                            case "donaciones":
                                category = "Donaciones"
                                break
                            case "reportes":
                                category = "Reportes"
                                break
                            case "sist-ilicito":
                                category = "Sistema ilícito"
                                break
                            case "comercio":
                                category = "Comercio"
                                break
                            case "otros":
                                category = "Otros"
                                break;
                        }
                        
                        if (ticketCategory !== "otros")
                        i.channel.setName(`${ticketCategory}-${username}`);
                        
                        const ticket_embed = new Discord.MessageEmbed()
                        .setTitle("Ticket creado!")
                        .setDescription(`La ayuda llegará enseguida.\n<@${i.member.id}> ha creado un ticket con motivo de \`\`${category}\`\`.`)
                        .setColor(config.colorlessEmbed)
            
                        const ticket_buttons = new Discord.MessageActionRow()
                            .addComponents(
                                [
                                    new Discord.MessageButton()
                                        .setStyle("DANGER")
                                        .setCustomId("ticket-close")
                                        .setLabel("Cerrar ticket")
                                        .setEmoji("🔒")
                                ],
                                [
                                    new Discord.MessageButton()
                                        .setStyle("SECONDARY")
                                        .setCustomId("ticket-claim")
                                        .setLabel("Claimear ticket")
                                        .setEmoji("🗳️")
                                ]
                            );
                        
                        if (msg.deletable) {
                            msg.delete()
            
                            const staffRolId = "934149605963210832";
                            msg.channel.send({ content: `<@&${staffRolId}>`, embeds: [ticket_embed], components: [ticket_buttons] });
                        }
            
                        if (ticketCategory === "sist-ilicito") {
                            const sistIlicitoEmbed = new Discord.MessageEmbed()
                                .setDescription(
                                    "Si desea aplicar para PDB (Proyecto De Banda), tendrá que rellenar esta plantilla y enviarla como **PDF**." +
                                    "\`\`\`md\n----- Información OCC -----\n- Nombres de Discord de los integrantes: \n----- Información BANDA -----\n" +
                                    "- Nombre de la banda: \n- Barrio: \n- Sede: \n- Rangos: \n- Miembros y sus rangos: \n" +
                                    "- Historia de la banda (Lore), cómo se conocieron y historia individual de cada PJ: \n- Intención de la banda: \n" +
                                    "- Tipo de vestimenta: \n- Vehículos de la banda: \n\`\`\`\n" +
                                    "Cuando envíe el documento con la información, un encargado de facción ilícita le contestará.\n\n" +
                                    "*Recuerde que los miembros deben ser como mínimo 4 y como máximo 12.*"
                                )
                                .setColor(config.colorlessEmbed)
            
                            msg.channel.send({ embeds: [sistIlicitoEmbed] })
                        }
            
                    });
            
                    collector.on("end", collected => {
                        if (collected.size < 1) {
                            try {
                                msg.channel.send({ content: `No se ha seleccionado ninguna categoría. Cerrando ticket...`}).then(() => {
                                    setTimeout(() => {
                                        if (msg.channel.deletable) msg.channel.delete();
                                    }, 5000);
                                }).catch(err);
                            } catch (error) {
                                console.log("[IGNORE_ERR] El canal del ticket ha sido eliminado antes de que el collector terminara.") 
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