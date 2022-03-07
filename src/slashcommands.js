const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { clientId } = require("./config.json")
require("dotenv").config()

const rest = new REST({ version: "9" }).setToken(process.env.token)

createSlash()

async function createSlash() {
    try {
        const commands = []
        fs.readdirSync("./slashcommands").forEach(async (category) => {
            const commandFiles = fs.readdirSync(`./slashcommands/${category}`).filter((file) => file.endsWith(".js"))
            for (const file of commandFiles) {
                const command = require(`./slashcommands/${category}/${file}`)
                commands.push(command.data.toJSON())
            }
        })
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        )
        console.log("Slash commands uploaded successfully.")
    } catch (error) {
        console.error(error)
    }
}