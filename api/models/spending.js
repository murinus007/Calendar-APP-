const mongoose = require("mongoose");

const spendingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: String,
    amount: Number,
    date: String 
});

module.exports = mongoose.model('spending', spendingSchema);