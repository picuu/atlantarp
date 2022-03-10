const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "new-ticket"
    },

    async run(client, interaction) {
       
        let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "");
        let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.name === `ticket-${username}`));
        if (AlreadyCreatedTicket) return interaction.reply({ content: "Ya tienes un ticket abierto, no puedes crear otro!", ephemeral: true });

        const usuario_role = interaction.guild.roles.cache.find(role => role.name === "• Usuario");
        const everyone_role = interaction.guild.roles.cache.find(role => role.name === "@everyone");

        let categoryParent;

        if (interaction.channel.parent) {
            categoryParent = interaction.channel.parent;
        } else {
            if(!interaction.guild.channels.cache.find(channel => channel.name === "TICKETS")) { 
                categoryParent = await interaction.guild.channels.create(`TICKETS`, {
                    type: "GUILD_CATEGORY",
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },
                        {
                            id: usuario_role.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },
                        {
                            id: everyone_role.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        }
                    ]
                })
            } else {
                categoryParent = interaction.guild.channels.cache.find(channel => channel.name === "TICKETS");
            }

        }

        interaction.guild.channels.create(`ticket-${username}`, {
            type: "GUILD_TEXT",
            parent: categoryParent.id,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: usuario_role.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: everyone_role.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ]
        }).then(async (ticketChannel) => {

            interaction.reply({ content: `Tu ticket se ha creado satisfactoriamente! Ve a <#${ticketChannel.id}>`, ephemeral: true })

            const ticketCreated_embed = new Discord.MessageEmbed()
            .setTitle("Ticket creado!")
            .setDescription(`La ayuda llegará enseguida.\nEmpieza por decirnos el motivo del ticket, con ayuda del menú inferior.\n\nSi **no eliges ninguna categoría**, el ticket se **cerrará** automaticamente en **2 minutos**.`)
            .setColor(config.colorlessEmbed)

            const ticketCategoryMenu = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId("ticket-categories")
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Soporte",
                                description: "Soporte",
                                value: "soporte",
                                emoji: "🔧"
                            },
                            {
                                label: "CK/PKT",
                                description: "CK/PKT",
                                value: "ck-pkt",
                                emoji: "💀"
                            },
                            {
                                label: "Donaciones",
                                description: "Donaciones",
                                value: "donaciones",
                                emoji: "💸"
                            },
                            {
                                label: "Reportes",
                                description: "Reportes",
                                value: "reportes",
                                emoji: "⛔"
                            },
                            {
                                label: "Sistema ilícito",
                                description: "Sistema ilícito",
                                value: "sist-ilicito",
                                emoji: "🔪"
                            },
                            {
                                label: "Comercio",
                                description: "Comercio",
                                value: "comercio",
                                emoji: "🧑‍💼"
                            },
                            {
                                label: "Otros",
                                description: "Otros",
                                value: "otros",
                                emoji: "📋"
                            }
                        ])
                );

            await ticketChannel.send({ embeds: [ticketCreated_embed], components: [ticketCategoryMenu] }).then((msg) => {

                const ifilter = i => i.user.id === interaction.member.id
                const collector = msg.createMessageComponentCollector({ filter: ifilter, componentType: "SELECT_MENU", time: 120000 })
    
                collector.on("collect", async i => {
    
                    let category;
    
                    switch (i.values[0]) {
                        case "soporte":
                            category = "Soporte"
                            break
                        case "ck-pkt":
                            category = "CK/PKT"
                            break
                        case "donaciones":
                            category = "CK/PKT"
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
                        default:
                            category = "Otros"
                    }
                    
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

                        const rolSoporte = i.guild.roles.cache.find(role => role.name === "🔧┃Soporte");
                        msg.channel.send({ content: `<@&${rolSoporte.id}>`, embeds: [ticket_embed], components: [ticket_buttons] });
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
                            console.log("[IGNORE_ERR] Ticket channel was deleted before the collector ended.") 
                        }
                    }
                });

            });

        });

    }

}