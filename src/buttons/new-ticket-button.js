const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    data: {
        name: "new-ticket-button"
    },

    async run(client, interaction) {
                
        // interaction.deferReply({ ephemeral: true })
        
        let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "")
        let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.name === `ticket-${username}`))
        if (AlreadyCreatedTicket) return interaction.reply({ content: "You already have an active ticket!", ephemeral: true });

        const member_role = interaction.guild.roles.cache.find(role => role.name === "Member")
        const everyone_role = interaction.guild.roles.cache.find(role => role.name === "@everyone")

        interaction.guild.channels.create(`ticket-${username}`, {
            type: "GUILD_TEXT",
            parent: interaction.channel.parent.id,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: member_role.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },
                {
                    id: everyone_role.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }
            ]
        }).then(async (ticketChannel) => {

            interaction.reply({ content: `Your ticket has been created successfully! Go to <#${ticketChannel.id}>`, ephemeral: true })

            const ticket_created_embed = new Discord.MessageEmbed()
                .setTitle("Ticket created!")
                .setDescription("Help will arrive soon.\nStart by telling us the category the ticket is due, with the menu below.\n\nIf you don't choose a category, the ticket will be automatically deleted in 2 minutes.")
                .setFooter({ text: `${interaction.guild.name}'s Staff`, iconURL: "https://media.discordapp.net/attachments/697541387901468724/939110857995071488/png.png" })
                .setColor(config.colorlessEmbed)

            const ticket_category_row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId("ticket-categories")
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Failed to login",
                                description: "You cannot access your newly purchased account.",
                                value: "fail-login",
                                emoji: "🔑"
                            },
                            {
                                label: "Problems buying/reserving an account",
                                description: "There are issues while rerserving an account to buy it.",
                                value: "problems-reserving",
                                emoji: "🛒"
                            },
                            {
                                label: "Others",
                                description: "Annothers issues.",
                                value: "others",
                                emoji: "📋"
                            }
                        ])
                )

            await ticketChannel.send({ embeds: [ticket_created_embed], components: [ticket_category_row] }).then((msg) => {

                const ifilter = i => i.user.id === interaction.member.id
                const collector = msg.createMessageComponentCollector({ filter: ifilter, componentType: "SELECT_MENU", time: 120000 })
    
                collector.on("collect", async i => {
    
                    // i.deferReply({ ephemeral: true })
    
                    let category = "Others"
    
                    switch (i.values[0]) {
                        case "fail-login":
                            category = "Failed to login"
                            break
                        case "problems-reserving":
                            category = "Problems buying/reserving an account"
                            break
                        default:
                            category = "Others"
                    }
                    
                    const ticket_embed = new Discord.MessageEmbed()
                        .setTitle("Ticket created!")
                        .setDescription(`Help will arrive soon.\n<@${i.member.id}> created a new ticket with issues regarding \`\`${category}\`\`.`)
                        .setFooter({ text: `${interaction.guild.name}'s Staff`, iconURL: "https://media.discordapp.net/attachments/697541387901468724/939110857995071488/png.png" })
                        .setColor(config.colorlessEmbed)
    
                    const ticket_buttons = new Discord.MessageActionRow()
                        .addComponents(
                        [
                                new Discord.MessageButton()
                                    .setStyle("DANGER")
                                    .setCustomId("ticket-close")
                                    .setLabel("Close")
                                    .setEmoji("🔒")
                            ],
                            [
                                new Discord.MessageButton()
                                    .setStyle("SECONDARY")
                                    .setCustomId("ticket-claim")
                                    .setLabel("Claim")
                                    .setEmoji("🗳️")
                            ]
                        )
                    
                    if (msg.deletable) {
                        msg.delete()

                        const discordStaff_role = interaction.guild.roles.cache.find(role => role.name === "Support")
                        msg.channel.send({ content: `<@&${discordStaff_role.id}>`, embeds: [ticket_embed], components: [ticket_buttons] });
                    }
    
                });

                collector.on("end", collected => {
                    if (collected.size < 1) {
                        msg.channel.send({ content: `No category selected. Closing the ticket...`}).then(() => {
                            setTimeout(() => {
                                if (msg.channel.deletable) msg.channel.delete();
                            }, 5000);
                        });
                    }
                });

            });


        });


    }

}