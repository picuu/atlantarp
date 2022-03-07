const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "bansLogsChannel" }
)

module.exports = mongoose.model("bansLogsChannel", model)