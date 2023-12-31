const Booking = require('../models/booking');
const Trip = require("../models/trips");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.bookTrip = async (req, res) => {
  // Validate the request using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    
    const { tripId, paymentReferenceNumber, paymentType, travelClass, seatType } = req.body;
    const { userId } = req.params;

    // Check if the trip exists
    // const trip = await Trip.findById(tripId);
    // if (!trip) {
    //   return res.status(404).json({ error: 'Trip not found' });
    // }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({error: 'User not found'})
    }

    // Create a new booking
    const booking = new Booking({
      userId: userId,
      tripId,
      paymentReferenceNumber,
      booking_details: {
        paymentType,
        travelClass,
        seatType
      },
    });

    // Save the booking to the database
    const savedBooking = await booking.save();

    // You may perform additional logic here, such as updating trip details, sending notifications, etc.

    res.json(savedBooking);
    console.log(savedBooking, "84")
  } catch (error) {
    console.error('Error booking trip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserBookings = async (req, res) => {
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

    // const tripId = mongoose.Types.ObjectId(req.query.tripId);
    // console.log(tripId, "WW");
    // Use $match aggregation stage to filter bookings for the user
    const userBookings = await Booking.aggregate([
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
          "StartTime":"$result.trips_details.StartTime" ,
          "EndTime":"$result.trips_details.EndTime",
          // "bookingId": "$_id"
        }
      }
    ]);

    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

