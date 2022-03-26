const mongoose = require("mongoose");

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "checkSuggestionsCh" }
);

module.exports = mongoose.model("checkSuggestionsCh", model);