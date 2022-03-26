const { model, Schema } = require("mongoose");

module.exports = model("suggestDB", new Schema({
    guildId: String,
    messageId: String,
    details: Array
}));