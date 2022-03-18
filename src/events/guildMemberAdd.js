const { MessageAttachment, MessageEmbed } = require("discord.js");
const joinsLogsModel = require("../models/joinsLogs.js");
const welcomesModel = require("../models/welcomes.js")
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        // Welcome image

        registerFont("./fonts/AkiraExpanded.otf", { family: "Akira Expanded" })
        registerFont("./fonts/BerlinSansFB.ttf", { family: "Berlin Sans FB" })

        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
        
            let fontSize = 72;
        
            do {
                ctx.font = `${fontSize -= 10}px "Akira Expanded"`;
            } while (ctx.measureText(text).width > canvas.width - 300);
        
            return ctx.font;
        };

        const canvas = createCanvas(1024, 500);
		const ctx = canvas.getContext('2d');

		const background = await loadImage("./files/welcome-bg-0.png");
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        ctx.font = '18px "Berlin Sans FB"'
        ctx.fillText("Bienvenido a Atlanta Roleplay, disfruta del rol!", 512, 345)

		ctx.font = applyText(canvas, `${member.user.tag.toUpperCase()}`);
		ctx.fillText(`${member.user.tag.toUpperCase()}`, 512, 405);

        ctx.beginPath();
        ctx.arc(512, 176, 133, 0, Math.PI * 2, true);
        ctx.fill();

		ctx.beginPath();
		ctx.arc(512, 176, 121, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ size: 512, format: 'png' }));
		ctx.drawImage(avatar, 391, 55, 245, 245);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome.png');

        let welcomesChannel;
        let welcomesData = await welcomesModel.findOne({ guildId: member.guild.id })
        if (welcomesData) {
            welcomesChannel = welcomesData.channelId;

            client.channels.cache.get(welcomesChannel).send({ files: [attachment] });
        };


        // Send join log

        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} | ${member.user.id}`)
            .setDescription(`Se ha unido al servidor.\n\nCreación de la cuenta: <t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`)
            .setThumbnail(member.displayAvatarURL({ size: 300, dynamic: true, format: "png" }))
            .setTimestamp()
            .setColor("GREEN")

        let joinsChannel;
        let joinsData = await joinsLogsModel.findOne({ guildId: member.guild.id })
        if (joinsData) {
            joinsChannel = joinsData.channelId;

            member.guild.channels.cache.get(joinsChannel).send({ embeds: [embed] });
        };

    }
}