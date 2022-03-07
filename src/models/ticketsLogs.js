const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "ticketsLogsChannel" }
)

module.exports = mongoose.model("ticketsLogsChannel", model)