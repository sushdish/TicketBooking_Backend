const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const offerSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    
  },
  userId: {
    type: ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    default: "Active"
  },
  route_details: {
    type: Object,
    default: {
        DestinationA: "",
        DestinationB: "",
        Price: 0,
        EndDate: Date.now(),
        Message: "",
    },
    required: true,
  },
    
}, { timestamps: true });



module.exports = mongoose.model("Offer", offerSchema);