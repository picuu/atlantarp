const Discord = require("discord.js");
const config = require("../config.json");
const whitelistModel = require("../models/whitelistLogs.js");
const { createTranscript } = require("discord-html-transcripts");
const ms = require("ms");

module.exports = {
    data: {
        name: "whitelist-new"
    },

    async run(client, interaction) {
       
        let username = interaction.user.username.toLowerCase().replace(/\W/g, "-").replace(/--/g, "-").replace(/-$/, "");
        let AlreadyCreatedTicket = await interaction.guild.channels.cache.find(channel => (channel.name === `solicitud-${username}`));
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

        interaction.guild.channels.create(`solicitud-${username}`, {
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
            .setTitle("Solicitud creada!")
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
                    ]
                );

            await petitionChannel.send({ embeds: [petitionOpened_embed], components: [petitionButtons] }).then((channel) => {

                // const ifilter = i => i.user.id === interaction.member.id
                const collector = channel.createMessageComponentCollector({ componentType: "BUTTON" })

                collector.on("collect", async i => {

                    // Roles: Soporte, Soporte+, Moderador, STAFF, Tecnico Discord, Gestion Staff, Co-Fundador, Fundador
                    const rolesIds = ["934149605984174144", "934149605984174145", "934149605984174146", "934149605963210832", "934149605984174149", "934149606013567006", "934149606013567007", "934149606013567008"];
                    if (!rolesIds.some(r => i.member.roles.cache.has(r))) return i.reply({ content: `No tienes el rango suficiente para hacer eso!`, ephemeral: true });

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
                        let data = await whitelistModel.findOne({ guildId: interaction.member.guild.id })
                        if (data) {
                            logsChannel = await interaction.guild.channels.cache.get(data.channelId)
                
                            logsChannel.send({ embeds: [registerPetitionEmbed], files: [attachment] })
                        } else {
                            return i.reply({ content: `No hay un canal establecido para los logs de la Whitelist. Establece uno con el comando \`\`/set_logs\`\`.`, ephemeral: true })
                        }

                        i.reply({ content: "La petición ha sido aceptada correctamente! El canal se eliminará en 10 segundos...", ephemeral: true })

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
                            fileName: `whitelist-accept-${petitionChannel.name}.html`
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

                    }
    
                });

            });

        });

    }

}