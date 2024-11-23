const mongoose = require('mongoose');
const generate = require("../helpers/generate");

const voteSchema = new mongoose.Schema({
    tokenUser: String,
    star: Number,
    desc: String,
    product_id: String
}, {
    timestamps: true
});
const Vote = mongoose.model("Vote", voteSchema, "votes");

module.exports = Vote;