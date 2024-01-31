const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema


const cancellationSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
    },
    tripId: {
        type: ObjectId,
        ref: "Trip",
    },
    bookingId: {
        type: ObjectId,
        ref: "Booking",
    },
    userReason: {
        type: String,
    },
    adminReason: {
        type: String,
    },
    requestSolved: {
        type: Boolean,
        default: false,
    },
    refundAmount: {
        type: Number,
       
    },
    // refundId: {
    //     type:  ObjectId,
    //     ref: "Refund"
    // }

})

cancellationSchema.statics.getPendingCancellations = async function () {
    return this.find({ requestSolved: false })
      .populate('userId', 'name') // Adjust this based on your User schema
      .populate('tripId', 'tripDetails') // Adjust this based on your Trip schema
      .populate('bookingId', 'bookingDetails'); // Adjust this based on your Booking schema
  };

module.exports = mongoose.model("Cancellation", cancellationSchema);