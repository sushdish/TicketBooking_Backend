const Booking = require('../models/booking');
const Trip = require("../models/trips");
const { validationResult } = require('express-validator');
const User = require("../models/user")
const mongoose = require('mongoose');

exports.bookTrip = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    
    const { tripId, paymentReferenceNumber, paymentType, travelClass, seatType } = req.body;
    const { userId } = req.params;

    console.log('Request Body:', req.body);
   

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({error: 'User not found'})
    }

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

    console.log(booking, "11")
  
    const savedBooking = await booking.save();
    console.log('Saved Booking:', savedBooking);

    

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

    
    const pipeline = [
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
    ];

    const AllBookings = await Booking.aggregate(pipeline)

    pipeline.push(
      { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
      { $limit: 5 },
    )

    const userBookings = await Booking.aggregate(pipeline)

    res.json({
      bookings: userBookings,
      totalBooking: AllBookings.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPigination = async (req, res) => {
  
  console.log("Hits here")
    try {
      const pipeline = [
        { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
        { $limit: 5 },
      ]
  
      const result = await Booking.aggregate(pipeline)
      res.json(result)
    } catch (error) {
      await logger.createLogger(error.message, "trips", "getAllTrip")
      res.json(error.message)
    }
  
  
  
  };

  exports.getUserRewards = async (req, res) => {
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
  
      
      const pipeline = [
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
            "RewardPoints": "$result.trips_details.RewardPoints"
            // "bookingId": "$_id"
          }
        }
      ];
  
      const AllRewardPoints = await Booking.aggregate(pipeline)
  
      pipeline.push(
        { $skip: JSON.parse(req.query.page) > 0 ? ((JSON.parse(req.query.page) - 1) * 5) : 0 },
        { $limit: 5 },
      )
  
      const userPoints = await Booking.aggregate(pipeline)
  
      res.json({
        rewardPoint: userPoints,
        totalPoints: AllRewardPoints.length
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }; 

  // exports.getTotalBookings = async (req, res) => {
  //   try {
  //     const totalBookings = await Booking.countDocuments();
  
  //     res.json({ totalBookings });
  //   } catch (error) {
  //     console.error('Error fetching total bookings:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // };

  exports. getTotalBookings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      const pipeline = await Booking.aggregate([

        {
          $lookup: {
            'from': 'trips',
            'localField': 'tripId',
            'foreignField': '_id',
            'as':'result'
          }
        },
        {
          '$unwind': {
            'path': '$result'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {$sum: {$toInt :'$result.trips_details.TicketAmount' }},
          },
        },
        {
          $project: {
            _id:0,                 //0 = excluded the field
            totalRevenue: 1         // 1 = include the field
          }
        },
      ])

      res.json(pipeline[0])
      console.log(pipeline, "67")

    }catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  }