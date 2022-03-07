const { Interaction } = require("discord-modals")
const { Discord, Client, Collection, MessageEmbed } = require("discord.js")
require("dotenv").config()
const config = require("./config.json")

const client = new Client({ intents: 32767 })

client.slashCommands = new Collection()
client.buttons = new Collection()
client.selectMenus = new Collection()

require("./handlers/events.js")(client);
require("./handlers/slashcommands.js")(client);
require("./handlers/buttons.js")(client);
require("./handlers/selectmenus.js")(client);

setInterval(() => {
    updatePresence()
}, 60000)

async function updatePresence() {
    const guildsNum = await client.guilds.cache.size
    const memberNum = await client.users.cache.size

    await client.user.setActivity(`${memberNum} members`, { type: "WATCHING" });
}

const discordModals = require("discord-modals")
discordModals(client)

client.on("modalSubmit", async (modal) => {
    if (modal.customId === "tools-modal") {

        await modal.deferReply({ ephemeral: true })

        const title = modal.getTextInputValue("text-title");
        const description = modal.getTextInputValue("text-description");
        const warning = modal.getTextInputValue("text-warning");
        const link = modal.getTextInputValue("text-link");
        const imgs = modal.getTextInputValue("text-imgs");

        modal.followUp({ content: "The modal has been sent!", ephemeral: true })

        const messageContent = `**${title}**\n\n${description}\n\n**${warning}**\n\n${link}`;

        if (!imgs) {
            return modal.channel.send({ content: messageContent })
        } else {
            modal.channel.send({ content: messageContent, files: imgs.split(" ") })
        }

    }
})

client.login(process.env.token)