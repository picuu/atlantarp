const { setInterval } = require("timers")
const mongoose = require("mongoose")
require("dotenv").config()

module.exports = {
    name: "ready",
    
    execute(client) {

        mongoose.connect(process.env.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => { console.log("Conectado correctamente con MongoDB.") })

        console.log("Bot listo!")
        console.log("https://discord.com/api/oauth2/authorize?client_id=951128687254839316&permissions=8&scope=bot%20applications.commands")

    }
}