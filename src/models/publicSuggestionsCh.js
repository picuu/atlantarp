const mongoose = require("mongoose");

const model = new mongoose.Schema({
    guildId: { type: String },
    channelId: { type: String }
},
    { collection: "publicSuggestionsCh" }
);

module.exports = mongoose.model("publicSuggestionsCh", model);