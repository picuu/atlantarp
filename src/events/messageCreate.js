const Discord = require("discord.js");
const config = require("../config.json");
const request = require("request");
const fs = require("fs");
const moment = require("moment");
require("dotenv").config();

const webhookClient = new Discord.WebhookClient({ id: process.env.errorWebhookID, token: process.env.errorWebhookToken });

module.exports = {
    name: "messageCreate",
    
    async execute(client, message) {
        
        if (message.attachments.first()) {
            const pdfURL = message.attachments.first().url;
            if (pdfURL.substr(pdfURL.length - 3, pdfURL.length) === "pdf") {
                download(message.attachments.first().url);

                function download(url) {
                    const date = moment().format("X");
                    request.get(url)
                        .on("error", console.error)
                        .pipe(fs.createWriteStream(`./files/PDFs/${date}-${message.channel.name}.pdf`));
                }
            }
        }

    }
}