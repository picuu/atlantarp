const Discord = require("discord.js");
const config = require("../config.json");
require("dotenv").config();
const executeCommand = require("../functions/executeCommand.js");
const executeSelectMenu = require("../functions/executeSelectMenu.js");
const executeButton = require("../functions/executeButton.js");

const webhookClient = new Discord.WebhookClient({ id: process.env.errorWebhookID, token: process.env.errorWebhookToken });

module.exports = {
    name: "interactionCreate",
    
    async execute(client, interaction) {
        
        if (interaction.isCommand()) executeCommand(client, interaction, webhookClient);
        
        if (interaction.isSelectMenu()) executeSelectMenu(client, interaction, webhookClient);

        if (interaction.isButton()) executeButton(client, interaction, webhookClient);

    }
}