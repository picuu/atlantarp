const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    accounts: { type: Object }
},
    { collection: "Guilds" }
)

module.exports = mongoose.model("Guilds", model)