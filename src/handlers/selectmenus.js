const fs = require("fs")
const selectMenus = fs.readdirSync("./selectmenus")

module.exports = (client) => {

    for (const file of selectMenus) {
        const selectMenu = require(`../selectmenus/${file}`)
        client.selectMenus.set(selectMenu.data.name, selectMenu)
    }
    
}