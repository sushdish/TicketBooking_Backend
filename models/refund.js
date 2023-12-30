const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const refundSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
    },
    tripId: {
        type: ObjectId,
        ref: "Trip",
    },
    amount: {
        type: Number,
    },
})

module.exports = mongoose.model("Refund", refundSchema);