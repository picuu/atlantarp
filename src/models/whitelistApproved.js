const mongoose = require("mongoose");

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "whitelistApproved" }
);

module.exports = mongoose.model("whitelistApproved", model);