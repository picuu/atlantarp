const mongoose = require("mongoose");

const model = new mongoose.Schema({
    userId: { type: String },
    tracking: { type: Boolean }
},
    { collection: "suggestTracking" }
);

module.exports = mongoose.model("suggestTracking", model);