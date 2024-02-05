
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
  },
  tripNumber: {
    type: Number,
  },
  userId: {
    type: ObjectId,
    ref: "User"
  },
  trips_details: {
    type: Object,
    default: {
        DestinationA: "",
        DestinationB: "",
        SeatCount: 0,
        StartTime: Date.now(),
        EndTime: Date.now(),
        BaggageAllowance: 0,
        TicketAmount: 0,
        SeatType: [],
        TravelClass: [],
        Currency: "",
        PaymentType: [],
        RewardPoints: 0,
    },
    required: true,
  },
    
}, { timestamps: true });



module.exports = mongoose.model("Trip", tripSchema);