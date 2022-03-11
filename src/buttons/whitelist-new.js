const Discord = require("discord.js")
const config = require("../config.json")
const ms = require("ms")

module.exports = {
    data: {
        name: "whitelist-new"
    },

    async run(client, interaction) {
       
        let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "");
        let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.name === `allow-petition-${username}`));
        if (AlreadyCreatedTicket) return interaction.reply({ content: "Ya tienes una solicitud abierta, no puedes abrir otra!", ephemeral: true });

        const usuario_role = interaction.guild.roles.cache.find(role => role.name === "• Usuario");
        const everyone_role = interaction.guild.roles.cache.find(role => role.name === "@everyone");

        let categoryParent;

        if (interaction.channel.parent) {
            categoryParent = interaction.channel.parent;
        } else {
            if(!interaction.guild.channels.cache.find(channel => channel.name === "WHITELIST")) { 
                categoryParent = await interaction.guild.channels.create(`WHITELIST`, {
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
                categoryParent = interaction.guild.channels.cache.find(channel => channel.name === "WHITELIST");
            }
        }

        interaction.guild.channels.create(`allow-petition-${username}`, {
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
        }).then(async (petitionChannel) => {

            interaction.reply({ content: `Tu solicitud se ha creado correctamente! Ve a <#${petitionChannel.id}>`, ephemeral: true })

            const petitionOpened_embed = new Discord.MessageEmbed()
            .setTitle("Petición creada!")
            .setDescription(
                `Envia un mensaje rellenando los siguientes campos:\n` +
                `\`\`\`Nombre de tu personaje\nFecha de nacimiento\nOrigen del personaje\nTrabajos o empleos que ha tenido o aspire a tener\nExpectativas con las que tu personaje viene/vuelve a la ciudad de Los Santos\nDetalla la mentalidad y personalidad de tu personaje\nHistoria del personaje\`\`\`` +
                `\n\n*Un moderador vendrá a revisar tu petición en breves, por favor, se paciente.*`
            )
            .setColor(config.colorlessEmbed)

            const petitionButtons = new Discord.MessageActionRow()
                .addComponents(
                    [
                        new Discord.MessageButton()
                            .setStyle("SUCCESS")
                            .setCustomId("petition-accept")
                            .setLabel("Aceptar petición")
                            .setEmoji("✅")
                    ],
                    [
                        new Discord.MessageButton()
                            .setStyle("DANGER")
                            .setCustomId("petition-deny")
                            .setLabel("Denegar petición")
                            .setEmoji("❎")
                    ]
                );

            await petitionChannel.send({ embeds: [petitionOpened_embed], components: [petitionButtons] }).then((channel) => {

                // const ifilter = i => i.user.id === interaction.member.id
                const collector = channel.createMessageComponentCollector({ componentType: "BUTTON" })

                collector.on("collect", async i => {

                    // Roles: TestServerSoporte, Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
                    rolesIds = "951239979936387153" || "934149605984174144" || "934149605984174145" || "934149605984174146" || "934149605963210832" || "934149605984174149" || "934149606013567006" || "934149606013567007" || "934149606013567008";
                    if (!i.member.roles.cache.has(rolesIds)) return i.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

                    if (i.customId === "petition-accept") {
                        
                        changePermissions(i, interaction.member)

                        const usuarioRoleId = "934149605938065455";
                        const testRoleId = "930550538481844314";
                        interaction.member.roles.add(testRoleId);

                        i.reply({ content: "La petición ha sido aceptada correctamente!", ephemeral: true })
                        i.channel.send({ content:`<@${interaction.member.user.id}>, tu solicitud ha sido aceptada! Ya tienes total acceso al servidor.\nEste canal se eliminará en 8 horas.`})


                    } else if (i.customId === "petition-deny") {

                        changePermissions(i, interaction.member)
                        
                        i.reply({ content: "La petición ha sido denegada.", ephemeral: true })
                        i.channel.send({ content: `<@${interaction.member.user.id}>, lo sentimos, tu solicitud ha sido denegada. Vuelve a intentarlo en un futuro.\nEste canal se eliminará en 8 horas.`})

                    }

                    function changePermissions (int, member) {
                        int.channel.permissionOverwrites.edit(member, {
                            SEND_MESSAGES: false,
                        })
                    };

                    channel.edit({ embeds: [petitionOpened_embed], components: [] }).then(() => {
                        collector.stop()
                        setTimeout(() => {
                            if (petitionChannel.deletable) {
                                petitionChannel.delete()
                            }
                        }, ms("8h"))
                    })
    
                });

            });

        });

    }

}