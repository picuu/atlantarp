const fs = require("fs")
const categories = fs.readdirSync("./slashcommands")

module.exports = (client) => {

    categories.forEach(async (category) => {
        fs.readdir(`./slashcommands/${category}`, (err) => {
            if (err) return console.error(err);
            const commands = fs.readdirSync(`./slashcommands/${category}`).filter((file) => file.endsWith(".js"));
            for (const file of commands) {
                const command = require(`../slashcommands/${category}/${file}`)
                client.slashCommands.set(command.data.name, command)
            }
        })
    })
    
}