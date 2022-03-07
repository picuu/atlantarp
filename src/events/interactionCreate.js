const guildModel = require("../models/guild.js")
const config = require("../config.json");
const executeCommand = require("../functions/executeCommand.js");
const executeSelectMenu = require("../functions/executeSelectMenu.js");
const executeButton = require("../functions/executeButton.js");

module.exports = {
    name: "interactionCreate",
    
    async execute(client, interaction) {
        
        if (interaction.isCommand()) executeCommand(client, interaction);
        
        if (interaction.isSelectMenu()) executeSelectMenu(client, interaction);

        if (interaction.isButton()) executeButton(client, interaction);

    }
}