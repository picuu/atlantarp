const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "joinsLogsChannel" }
)

module.exports = mongoose.model("joinsLogsChannel", model)