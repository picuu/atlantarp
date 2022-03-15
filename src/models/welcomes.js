const mongoose = require("mongoose")

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "welcomes" }
)

module.exports = mongoose.model("welcomes", model)