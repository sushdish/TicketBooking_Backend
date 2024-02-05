const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const walletSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
    },
    type: {
        type: String,
       
    },
    amount: {
        type: Number,
    },
}, { timestamps: true })

module.exports = mongoose.model("Wallet", walletSchema);