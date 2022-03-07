const fs = require("fs")
const buttons = fs.readdirSync("./buttons")

module.exports = (client) => {

    for (const file of buttons) {
        const button = require(`../buttons/${file}`)
        client.buttons.set(button.data.name, button)
    }
    
}