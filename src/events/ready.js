const { setInterval } = require("timers")
const mongoose = require("mongoose")
require("dotenv").config()

module.exports = {
    name: "ready",
    
    execute(client) {

        mongoose.connect(process.env.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => { console.log("Successfully connected to MongoDB.") })

        console.log("Bot ready!")
        console.log("https://discord.com/api/oauth2/authorize?client_id=937147077136367677&permissions=8&scope=bot%20applications.commands")

    }
}