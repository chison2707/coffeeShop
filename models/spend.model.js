const mongoose = require('mongoose');

const spendSchema = new mongoose.Schema({
    token: String,
    desc: String,
    price: Number,
}, {
    timestamps: true
});
const Spend = mongoose.model("Spend", spendSchema, "spends");

module.exports = Spend;