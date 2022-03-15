const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "whitelistLogs" }
)

module.exports = mongoose.model("whitelistLogs", model)