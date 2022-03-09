const { MessageAttachment, MessageEmbed } = require("discord.js");
const joinsLogsChannelModel = require("../models/joinsLogs.js")
const { createCanvas, loadImage, registerFont } = require("canvas")

module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        // Add role to new member

        const memberRole = member.guild.roles.cache.find(role => role.name === "Member") || member.guild.roles.cache.find(role => role.id === "937060418432675881")
        member.roles.add(memberRole.id)


        // Welcome image

        registerFont("./fonts/AkiraExpanded.otf", { family: "Akira Expanded" })

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

		ctx.font = applyText(canvas, `${member.user.tag.toUpperCase()}`);
		ctx.fillText(`${member.user.tag.toUpperCase()}`, 512, 410);

        ctx.beginPath();
        ctx.arc(512, 166, 133, 0, Math.PI * 2, true);
        ctx.fill();

		ctx.beginPath();
		ctx.arc(512, 166, 121, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 391, 45, 245, 245);


		const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome.png');
        client.channels.cache.get("937740212916867103").send({ files: [attachment] });


        // Send join log

        let joinsLogsChannel;
        let data = await joinsLogsChannelModel.findOne({ guildId: member.guild.id })
        if (!data) {
                return;
        } else {
            joinsLogsChannel = data.channelId
        }

        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} | ${member.user.id}`)
            .setDescription(`Joined the server.`)
            .setTimestamp()
            .setColor("GREEN")

        member.guild.channels.cache.get(joinsLogsChannel).send({ embeds: [embed] })

    }
}