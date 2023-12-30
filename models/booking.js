const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const bookingSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
    },
    tripId: {
        type: ObjectId,
        ref: "Trip",
    },
    paymentReferenceNumber: {
        type: String
    },
    booking_details: {
        type: Object,
        paymentType: {
            type: String,
        },
        travelClass: {
            type: String,
        },
        seatType: {
            type: String,
        },
    }
})

module.exports = mongoose.model("Booking", bookingSchema);