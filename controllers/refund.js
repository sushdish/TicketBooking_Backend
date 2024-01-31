const Refund = require('../models/refund');
const Trip = require("../models/trips");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.refund = async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    console.log(user, "YY")
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {tripId, amount} = req.body

    const refund = new Refund({
        userId: userId,
        tripId,
        amount,
    })


    const savedRefund = await refund.save()


      res.json(savedRefund);
      console.log(savedRefund, "ZZ")
  }catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getUserRefunds = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    const pipeline = await Refund.aggregate([
      {
        $match: {
          'userId':  mongoose.Types.ObjectId(req.params.userId), // Assuming the 'user' field in Booking model references the 'User' model
        }
      },
      {
        $lookup: {
          'from':'trips',
          'localField': 'tripId',
          'foreignField': '_id',
          'as': 'result'
        }
        }, 
        {
         '$unwind':{
          'path':'$result'
        } 
      },
      {
        "$project":{
          "tripId":"$result._id", 
          "tripName":"$result.name",
          "tripDestinationA":"$result.trips_details.DestinationA",
          "tripDestinationB":"$result.trips_details.DestinationB" ,
          "refundAmount": "$amount"
          // "bookingId": "$_id"
        }
      }
    ]);

    // const AllBookings = await Booking.aggregate(pipeline)

    // pipeline.push(
    //   { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
    //   { $limit: 5 },
    // )

    // const userBookings = await Booking.aggregate(pipeline)

    res.json(pipeline);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};